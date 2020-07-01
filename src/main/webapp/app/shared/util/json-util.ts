export class JsonUtil {
  static valueToString(value: string): string {
    if (value) {
      return value
        .replace(/"/g, '')
        .replace(/{/g, ' ')
        .replace(/]/g, '')
        .replace(/,/g, '   ')
        .substring(1, value.length)
        .replace(/}/g, ' ');
    }
    return value;
  }

  static telefonesToString(value: string): string {
    if (value) {
      value = this.valueToString(value);
      return value.replace(/ddd:/g, ' (').replace(/numero:/g, ') ');
    }
    return value;
  }
}
