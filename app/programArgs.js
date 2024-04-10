function parseArgs() {
    const result = {
      elements: [],
      flags: {},
    };
    for (let i = 0; i < process.argv.length; i++) {
      let elt = process.argv[i];
      if (elt.startsWith("-")) {
        let endDots = 0;
        for (; endDots < elt.length && elt[endDots] === "-"; endDots++);
        if (endDots === elt.length) {
          result.elements.push(elt);
        } else {
          const flag = {};
          const value = i < process.argv.length ? process.argv[++i] : true;
          const name = elt.slice(endDots);
          flag[name] = value;
          result.elements.push(flag);
          result.flags[name] = value;
        }
      } else {
        result.elements.push(elt);
      }
    }
    return result;
  }

  module.exports = {parseArgs};