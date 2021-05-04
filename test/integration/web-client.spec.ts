/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as authenticateUser from 'src/token/authenticate';
import * as revokeToken from 'src/token/revoke';
import * as createUser from 'src/user/create';
import chance from 'test/helpers/chance';
import webClient from 'test/helpers/web-client';

describe('WebClient', () => {
  it('should call user-create function, When creating user', async () => {
    const stub = sinon.stub(createUser, 'default').resolves();

    await webClient.user.create({
      username: chance.name(),
      password: chance.name(),
    });

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should call authenticate-create function, When authenticating user', async () => {
    const stub = sinon.stub(authenticateUser, 'default').resolves();

    await webClient.token.authenticate({
      grantType: 'refreshToken',
      refreshToken: chance.guid(),
    });

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should call revoke-token function, When revoking token', async () => {
    const stub = sinon.stub(revokeToken, 'default').resolves();

    await webClient.token.revoke({
      refreshToken: chance.guid(),
    });

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });
});
