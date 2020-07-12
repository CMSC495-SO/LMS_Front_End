export class StorageManager {
  options = {
    useSession: true
  };

  constructor(options) {
    this.options = Object.assign(this.options, options);
  }

  add(key: string, data: string) {
    const storage = this.getStorage();

    storage.setItem(key, data);
  }

  getStorage() {
    return this.options.useSession ? sessionStorage : localStorage;
  }

  getStorageItem(key: string) {
    if (!this.getStorage().length) {
      return null;
    }

    return this.getStorage().getItem(key);
  }

  removeStorageItem(key) {
    this.getStorage().removeItem(key);
  }
}
