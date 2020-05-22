export interface Option {
   default: string;
   name: string;
   describe: string;
   description: string;
   group: string;
   type: string;
}

export interface Command {
   name: string;
   options: Option[];
   description: string;
   executor: any;
}

export interface Example {
   command: string;
   description: string;
}

export interface Footer {
   text: string;
   suffix: string;
}

export interface Inventory {
   commands: Command[];
   name: string;
   footer: Footer;
}