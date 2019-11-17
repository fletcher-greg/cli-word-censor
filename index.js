const { Transform } = require("stream");
const { createReadStream, createWriteStream } = require("fs");

const checkFileName = file => {
  let filetype = file.split(".")[1];
  if (filetype !== "txt") {
    return "not a valid filetype";
  }
};

class ReplaceText extends Transform {
  constructor([char, regex]) {
    super();
    this.replaceChar = char;
    this.regex = regex;
  }

  _transform(chunk, encoding, callback) {
    // console.log(this.regex);
    const transformChunk = chunk
      .toString()
      .toLowerCase()
      .replace(this.regex, this.replaceChar);
    this.push(transformChunk);
    callback();
  }

  _flush(callback) {
    this.push("more coming");
    callback();
  }
}

// create a censor tool.  You enter the words you want to censor
// the files are then censored

const main = () => {
  let fileName = process.argv[2];
  if (!fileName) {
    console.log("please enter a filename");
    return;
  }

  let check = checkFileName(fileName);

  if (check) {
    console.log(check);
    return;
  }

  let secretWord = process.argv[3];
  if (!secretWord) {
    console.log("please enter a secret word after the filename");
    return;
  }
  console.log("hi there this is working");
  const xStream = new ReplaceText(textReplace(secretWord));
  const fileStream = createReadStream(`./${fileName}`);
  const writeStream = createWriteStream("./censored.txt");
  fileStream.pipe(xStream).pipe(writeStream);

  function textReplace(text) {
    const replace = text.toLowerCase();
    const re = new RegExp(replace, "g");

    return ["x".repeat(text.length), re];
  }
};
main();
