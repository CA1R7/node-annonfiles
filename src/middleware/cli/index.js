/**
 * Annonfiles CLI
 */

class CLI {
  constructor() {
    this.argvs = process.argv;
    this.options = {};
    this.initializeOptions();
  }
  initializeOptions() {
    var i = 0;
    for (let argv of this.argvs) {
      if (argv.match(/^[--]{1,2}/)) {
        this.startOption(argv, i);
      }
      i++;
    }
  }
  startOption(argv, argvPlace) {
    const optionAnswer = this.argvs[argvPlace + 1];
    if (optionAnswer && !optionAnswer.match(/^[--]{1,2}/)) {
      let argvName = argv.replace(/^(--|-)/, "");
      this.options[argvName] = optionAnswer;
    }
    switch (argv) {
      case "--version":
      case "-v":
        const { version } = require("../../../package.json");
        console.log(`Version: ${version}`);
        break;
    }
  }
}

module.exports = () => {
  return new Promise((resolve) => {
    const cli_p = new CLI();
    resolve(cli_p.options);
  });
};
