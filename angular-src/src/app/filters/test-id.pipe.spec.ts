import { TestIdPipe } from './test-id.pipe';

describe('TestIdPipe', () => {
  it('create an instance', () => {
    const pipe = new TestIdPipe();
    expect(pipe).toBeTruthy();
  });
});
