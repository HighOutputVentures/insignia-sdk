/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as createUser from 'src/user/create';
import * as updateUser from 'src/user/update';
import * as deleteUser from 'src/user/delete';
import * as fetchEvents from 'src/event/fetch';
import chance from 'test/helpers/chance';
import serverClient from 'test/helpers/server-client';

describe('ServerClient', () => {
  it('should call user-create function, When creating user', async () => {
    const stub = sinon.stub(createUser, 'default').resolves();

    await serverClient.user.create({
      username: chance.name(),
      password: chance.name(),
    });

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should call user-update function, When updating user', async () => {
    const stub = sinon.stub(updateUser, 'default').resolves();

    await serverClient.user.update(chance.guid(), {
      isVerified: true,
    });

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should call user-delete function, When deleting user', async () => {
    const stub = sinon.stub(deleteUser, 'default').resolves();

    await serverClient.user.delete(chance.guid());

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should call fetch-events function, When fetching events', async () => {
    const stub = sinon.stub(fetchEvents, 'default').resolves();

    await serverClient.event.fetch({});

    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });
});
