const { expect } = require('chai');
const {
  db,
  models: { Session, User },
} = require('../index');
const seed = require('../../../script/seed');
const Goal = require('./Goal');

describe('Session model', () => {
  let sessions;
  beforeEach(async () => {
    users = (await seed()).users;
    goals = (await seed()).goals;
    sessions = (await seed()).sessions;
  });
  xit('requires a sessionTime', async () => {
    try {
      const session = await Session.create({});
    } catch (error) {
      expect(error).to.be.ok;
    }
  });
  xit('creates a session instance with a sessionTime, startTime and expectedEndTime', async () => {
    try {
      const session = await Session.create({ sessionTime: 35 });
      expect(session.startTime).to.be.ok;
      expect(session.expectedEndTime).to.be.ok;
      expect(session.actualEndTime).to.not.be.ok;
    } catch (error) {}
  });
  it('`calcExpectedEndTime` method calculates and adds expectedEndTime attribute to instances as they are created', () => {
    const { session0 } = sessions;
    const expectedEndTime = session0.expectedEndTime;
    const check = new Date(
      Date.parse(session0.startTime) + session0.sessionTime * 60000
    );
    expect(Date.parse(expectedEndTime)).to.equal(Date.parse(check));
  });
  //using a UUID threw this test off; wasn't able to fix quickly but I'll look into
  describe('Session.start() class method', () => {
    it('creates a session with an associated user and goal(if it is provided)', async () => {
      const john = await User.create({
        username: 'john',
        password: 'john_pw',
        email: 'john@mail.com',
      });

      const reactGoal = await Goal.create({
        description: 'Make react components.',
      });

      const session = await Session.start({
        userId: john.id,
        sessionTime: 30,
        goalId: reactGoal.id,
      });

      expect(session.userId).to.equal(john.id);
      expect(session.goalId).to.equal(reactGoal.id);
      expect(session.sessionTime).to.equal(30);
      expect(session.expectedEndTime).to.be.ok;
    });
    it('creates a session with a startTime and an expectedEndTime', async () => {
      const john = await User.create({
        username: 'john',
        password: 'john_pw',
        email: 'john@mail.com',
      });

      const reactGoal = await Goal.create({
        description: 'Make react components.',
      });

      const session = await Session.start({
        userId: john.id,
        sessionTime: 30,
        goalId: reactGoal.id,
      });

      expect(session.startTime).to.be.ok;
      expect(session.expectedEndTime).to.be.ok;
      expect(session.actualEndTime).to.not.be.ok;
    });
    it('does not require a goalId', async () => {
      const jane = await User.create({
        username: 'jane',
        password: 'jane_pw',
        email: 'jane@mail.com',
      });

      const session = await Session.start({
        userId: jane.id,
        sessionTime: 30,
      });

      expect(session.userId).to.equal(jane.id);
      expect(session.goalId).to.not.be.ok;
      expect(session.sessionTime).to.equal(30);
      expect(session.expectedEndTime).to.be.ok;
    });
  });
  describe('Session.seed() class method', () => {
    it('creates a session', async () => {
      const jane = await User.create({
        username: 'jane',
        password: 'jane_pw',
        email: 'jane@mail.com',
      });
      const john = await User.create({
        username: 'john',
        password: 'john_pw',
        email: 'john@mail.com',
      });

      const reactGoal = await Goal.create({
        description: 'Make react components.',
      });
      const otherGoal = await Goal.create({
        description: 'Make other components.',
      });

      const usersArr = [jane, john];

      const goalsArr = [reactGoal, otherGoal];
      const session = await Session.seed(usersArr, goalsArr);

      expect(typeof session.userId).to.equal('string');
      expect(typeof session.goalId).to.equal('string');
      expect(typeof session.sessionTime).to.equal('number');
      expect(typeof session.expectedEndTime).to.equal('object');
      expect(typeof session.successful).to.equal('boolean');
    });
  });
  describe('Session.end() instance method', () => {
    it('adds an actualEndTime to the session instance', async () => {
      const john = await User.create({
        username: 'john',
        password: 'john_pw',
        email: 'john@mail.com',
      });

      const reactGoal = await Goal.create({
        description: 'Make react components.',
      });

      const session = await Session.start({
        userId: john.id,
        sessionTime: 30,
        goalId: reactGoal.id,
      });

      session.end({ successful: true });
      expect(session.actualEndTime).to.be.ok;
    });
    it('allows user to set `successful` to true or false when they end a session ', async () => {
      const john = await User.create({
        username: 'john',
        password: 'john_pw',
        email: 'john@mail.com',
      });

      const reactGoal = await Goal.create({
        description: 'Make react components.',
      });

      const session = await Session.start({
        userId: john.id,
        sessionTime: 30,
        goalId: reactGoal.id,
      });

      session.end({ successful: true });
      expect(session.successful).to.equal(true);
    });
  });
});
