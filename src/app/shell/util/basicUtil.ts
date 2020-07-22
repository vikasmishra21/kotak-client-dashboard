export class BasicUtil {
  static deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if (obj instanceof Array) {
      return obj.reduce((arr, item, i) => {
        arr[i] = this.deepCopy(item);
        return arr;
      }, []);
    }

    if (obj instanceof Object) {
      return Object.keys(obj).reduce((newObj, key) => {
        newObj[key] = this.deepCopy(obj[key]);
        return newObj;
      }, {});
    }
  }

  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      let v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
