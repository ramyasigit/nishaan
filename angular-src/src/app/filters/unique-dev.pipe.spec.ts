import { UniqueDevPipe } from './unique-dev.pipe';

describe('UniqueDevPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqueDevPipe();
    expect(pipe).toBeTruthy();
  });
});
