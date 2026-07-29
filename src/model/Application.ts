export class Application {
  public init = async (): Promise<void> => {
    return new Promise((resolve) => {
      if (this._isInitialized()) {
        resolve();
        return;
      }
      const id = setInterval(() => {
        if (this._isInitialized()) {
          clearInterval(id);
          resolve();
        }
      }, 1000);
    });
  };

  private _isInitialized = (): boolean => true;
}

let instance: Application | undefined = undefined;

export const app = (): Application => {
  if (!instance) {
    instance = new Application();
  }
  return instance;
};
