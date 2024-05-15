const {
  flattenArr,
  dataFetcher,
  sortList,
  formatCurrency,
  handlePromises
} = require('./helpers.js');
const axios = require('axios');

jest.mock('axios');

describe('flattenArr', () => {
  it('return a non-nested arr', () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = [1, 2, 3, 4];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });

  it('flattens a nested arr', () => {
    const input = [1, 2, 3, [4, 5, [6, 7, [8, [9, [10]]]]]];
    const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });
});

describe('dataFetcher', () => {
  it('handles a successful response', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: { users: [] } }));

    const data = await dataFetcher();

    expect(data).toEqual({ data: { users: [] } });
  });

  it('handles an error response', async () => {
    axios.get.mockImplementation(() => Promise.reject('Boom'));

    try {
      await dataFetcher();
    } catch (e) {
      expect(e).toEqual(new Error({ error: 'Boom', message: 'An Error Occurred' }));
    }
  });
});

describe('sortList', () => {
  it('calls a sorter function if it is available', () => {
    const sortFn = jest.fn();

    sortList([3, 2, 1], sortFn);

    expect(sortFn).toBeCalled();
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn.mock.calls).toEqual([[[3, 2, 1]]]);
  });

  it('does not call a sorter function if the array has a length <= 1', () => {
    const sortFn = jest.fn();

    sortList([1], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);
  });
});

/**
 * Add you test/s here and get this helper file to 100% test coverage!!!
 * You can check that your coverage meets 100% by running `npm run test:coverage`
 */

describe('formatCurrency', () => {
  it('does return "$0.00" if NaN given', () => {
    expect(formatCurrency(NaN)).toEqual("$0.00");
  });
  it('does return "$5.01" if 5.00991 given', () => {
    expect(formatCurrency(5.00991)).toEqual("$5.01");
  });
});

describe('handlePromises', () => {
  it('does resolve on just resolving promises', () => {
    const tasks = [
      () => new Promise((res,rej) => res()),
      () => new Promise((res,rej) => setTimeout(() => res(), 1000)),
      () => new Promise((res,rej) => res()),
    ]
    expect(handlePromises(tasks)).toEqual(Promise.resolve(""));
  });
  it('throws error on just one rejecting promise', async () => {
    const tasks = [
      () => new Promise((res,rej) => res()),
      () => new Promise((res,rej) => setTimeout(() => rej(), 1000)),
      () => new Promise((res,rej) => setTimeout(() => rej(), 100000)),
    ]
    try {
      await handlePromises(tasks);
      expect(false).toEqual(true);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  it('throws error on attribute null', async () => {
    const tasks = null
    try {
      await handlePromises(null);
      expect(false).toEqual(true);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });
  
  it('throws error on no attribute', async () => {
    try {
      await handlePromises();
      expect(false).toEqual(true);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });
});
