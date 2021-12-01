import sinon from 'sinon';

import { SireneAPI } from '@job-guetter/api-core/connectors';

describe('@job-guetter/api-core/connectors/SireneAPI', () => {

  test('should set a new SireneAPI app setting', () => {
    const set = sinon.spy();
    SireneAPI({ set });
    expect(set.called).toBe(true);
  });

});
