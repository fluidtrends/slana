import out from "chalk"

import {
    Inventory
} from '.'

export function epilog(pkg: any, showDetails: boolean, inventory: Inventory) {
    const promptPrefix = "Type ";
    const promptSuffix = " for detailed usage instructions, including useful examples.";
    const promptSuffixAgain = " to see these detailed usage instructions again.";
    const prompt = inventory.name + " help";

    var text = "\n"
    
    if (showDetails) {
        text = text + out.bold(promptPrefix) + out.green(prompt) + out.bold(promptSuffixAgain);
        text = text + "\n" + out.bold("-".repeat(promptPrefix.length + prompt.length + promptSuffixAgain.length));
    } else {
        text = text + out.bold(promptPrefix) + out.green(prompt) + out.bold(promptSuffix);
        text = text + "\n" + out.bold("-".repeat(promptPrefix.length + prompt.length + promptSuffix.length));        
    }
       
    if (inventory.footer && inventory.footer.text) {
        text = text + "\n\n"
        var footer = (inventory.footer.suffix ? out.yellow(inventory.footer.suffix) + " " : "");
        footer = footer + out.grey(inventory.footer.text);
        text = text + footer + "\n\n"
        // text = text + boxen(footer, { padding: 1, margin: 0, borderStyle: 'round', dimBorder: true })
    }

    text = text + "\n\n" + out.grey("v" + pkg.version);

    return text
}