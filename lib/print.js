"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.epilog = void 0;
var chalk_1 = __importDefault(require("chalk"));
function epilog(pkg, showDetails, inventory) {
    var promptPrefix = "Type ";
    var promptSuffix = " for detailed usage instructions, including useful examples.";
    var promptSuffixAgain = " to see these detailed usage instructions again.";
    var prompt = inventory.name + " help";
    var text = "\n";
    if (showDetails) {
        text = text + chalk_1.default.bold(promptPrefix) + chalk_1.default.green(prompt) + chalk_1.default.bold(promptSuffixAgain);
        text = text + "\n" + chalk_1.default.bold("-".repeat(promptPrefix.length + prompt.length + promptSuffixAgain.length));
    }
    else {
        text = text + chalk_1.default.bold(promptPrefix) + chalk_1.default.green(prompt) + chalk_1.default.bold(promptSuffix);
        text = text + "\n" + chalk_1.default.bold("-".repeat(promptPrefix.length + prompt.length + promptSuffix.length));
    }
    if (inventory.footer && inventory.footer.text) {
        text = text + "\n\n";
        var footer = (inventory.footer.suffix ? chalk_1.default.yellow(inventory.footer.suffix) + " " : "");
        footer = footer + chalk_1.default.grey(inventory.footer.text);
        text = text + footer + "\n\n";
        // text = text + boxen(footer, { padding: 1, margin: 0, borderStyle: 'round', dimBorder: true })
    }
    text = text + "\n\n" + chalk_1.default.grey("v" + pkg.version);
    return text;
}
exports.epilog = epilog;
//# sourceMappingURL=print.js.map