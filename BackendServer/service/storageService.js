let path=require('path');
module.exports={
      getScriptFolderPath(){
            return path.join(path.resolve(__dirname,'..'),'scripts\\');},
            
      getScriptPath(fileName){
            return path.join(path.resolve(__dirname,'..'),'scripts\\',fileName);},
      
      getOutputFolderPath(){
            return path.join(path.resolve(__dirname,'..'),'Output\\');},
            
      getOutputInfoPath(fileName){
            return path.join(path.resolve(__dirname,'..'),'Output\\Info\\',fileName);},
       
      getOutputErrorPath(fileName){
            return path.join(path.resolve(__dirname,'..'),'Output\\Error\\',fileName);}

}

