import { wakeApi, wakeApiFromBrowser } from './wake-api';

describe('wakeApiFromBrowser', () => {
  it('dispara GET no-cors para o /health da API', () => {
    const fetchImpl = jest.fn().mockResolvedValue({} as Response);
    wakeApiFromBrowser('https://api.example.com', fetchImpl);
    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.com/health',
      expect.objectContaining({ mode: 'no-cors' }));
  });

  it('não faz nada sem origem e não lança com falha de rede', async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error('offline'));
    wakeApiFromBrowser(undefined, fetchImpl);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(() => wakeApiFromBrowser('https://api.example.com', fetchImpl)).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});

function fakeClock() {
  let t = 0;
  return {
    now: () => t,
    sleep: async (ms: number) => { t += ms; },
  };
}

describe('wakeApi', () => {
  it('tenta de novo até o /health responder OK', async () => {
    const clock = fakeClock();
    const fetchImpl = jest.fn()
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response);

    await expect(wakeApi('https://api.example.com', { fetchImpl, ...clock })).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.example.com/health');
  });

  it('desiste após o prazo sem lançar erro', async () => {
    const clock = fakeClock();
    const fetchImpl = jest.fn().mockRejectedValue(new Error('timeout'));

    await expect(wakeApi('https://api.example.com/', {
      fetchImpl, deadlineMs: 20_000, intervalMs: 5_000, ...clock,
    })).resolves.toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
  });
});
