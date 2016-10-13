const gdFormula = {
    build: (type, name, fmla) => {
        let param = fmla.split(' '),
            cmd = token.shift(1);
        
        (this.type || (this.type = {}))[name] = { cmd: cmd, param: param };
    }
}