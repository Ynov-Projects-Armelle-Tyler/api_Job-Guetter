import sinon from 'sinon';

import { Redis } from '@job-guetter/api-core/connectors';

describe('@poool/api-core/connectors/Redis', () => {

  test('should set a new Redis app setting', () => {
    const set = sinon.spy();
    Redis({ set });
    expect(set.called).toBe(true);
  });

});
