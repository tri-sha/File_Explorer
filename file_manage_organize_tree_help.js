let fs = require("fs");
let path =require("path");
let input=process.argv.slice(2);
let types = {
        media:["mp4","mkv","jpg","jpeg"],
        archives:['zip','7z','rar','iso','ar'],
        documents:['docx','pdf','txt'],
        app:['exe','pkg','deb']
}

switch (input[0]){
    case "tree":
        manageTree(input[1]);
        break;
    case "organize":
        manageOrganize(input[1]);
        break;
    case "help":
        manageHelp();
        break;
    default:
        console.log("Input right command ❤");
}

function manageHelp(){
    console.log(
        `List of commands :
            node nodePractical.js tree "directoryPath"
            node nodePractical.js organize "directoryPath"
            node nodePractical.js help`
     );
}

function manageTree(dirpath){
    if(dirpath==undefined){
        console.log("Please Enter a path");
        return;
    }
    else{
        if(fs.existsSync(dirpath)==false){
            console.log("Please Enter a path");
            return; 
        }
        else
         treeHelper(dirpath,""); 
    }
}

function treeHelper(dirpath,indent){
    let isFile= fs.lstatSync(dirpath).isFile();
    if(isFile){
        let filename=path.basename(dirpath);
        console.log(indent+"|---"+filename);
    }
    else{
        let dirname=path.basename(dirpath);
        console.log(indent+"|___"+dirname);
        let children = fs.readdirSync(dirpath);
        for(let i=0;i<children.length;i++){
            let childpath=path.join(dirpath,children[i]);
            treeHelper(childpath,indent+"\t");
        }
    }
}

function manageOrganize(dirpath){
    // Directory path given

    if(dirpath==undefined){
        console.log("Please enter a Valid Directory path");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirpath);
        if(doesExist){
            // create a directory of organized_path
            let destpath = path.join(dirpath,"Organized_dir");
            if(fs.existsSync(destpath)==false)
                fs.mkdirSync(destpath);
            // copy all files in other directory
            organizeHelper(dirpath,destpath);
        }
        return;
    }
    
}

function organizeHelper(src,dest){
    let childNames = fs.readdirSync(src);
    console.log(childNames);
    for(let i=0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            let category = getCategory(childNames[i]);
             console.log(childNames[i]+"-->"+category);
             sendFileToDest(dest,childAddress,category);

        }
    }
}


function getCategory(filename){
    // identify category of all files of given directory
    //to get extension of file
    let ext=path.extname(filename);
    //to remove dot
    ext=ext.slice(1);
    for(let type in types){
        let cTypeArr = types[type];
        for(let i=0;i<cTypeArr.length;i++){
            if(ext==cTypeArr[i]){
                return type;
            }
        }
    }
    return "others";
}


function sendFileToDest(dest,srcFilePath,category){
    let categorypath = path.join(dest,category);
    if(fs.existsSync(categorypath)==false){
        fs.mkdirSync(categorypath);
    }
    let filename=path.basename(srcFilePath);
    let destFilePath=path.join(categorypath,filename);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log("file copied  -->" + filename);
}