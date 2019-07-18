class ResPackage {
    constructor(){
        this.status = true;                    // Status
        this.message = "OK";                // Error message
        this.data = null;                   // Data list
        this.timeSpan = new Date();           // MS
    };

    fillResWithData(Data){
        this.status = true;
        this.data = Data;
        this.timeSpan = new Date() - this.timeSpan;
    };
    fillResWithError(errMsg){
        this.status = false;                    // Status
        this.message = errMsg.message;                  // Error message
        this.timeSpan = new Date() - this.timeSpan;
    }
}

module.exports = ResPackage;
