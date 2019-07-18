let path=require('path');

module.exports={
  getScriptFolderPath(){
        return path.join(path.resolve(__dirname,'..'),'scripts\\');},

  getScriptPath(fileName){
        return path.join(path.resolve(__dirname,'..'),'scripts\\',fileName);}
       
}

