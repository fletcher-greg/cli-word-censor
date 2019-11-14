const { Transform } = require("stream");
const { createReadStream, createWriteStream } = require("fs");

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
    this.push("more stuff is being passed...");
    callback();
  }
}
let secretWord = process.argv[2];
if (!secretWord) {
  console.log("please enter a secret word after the filename");
  return;
}
const xStream = new ReplaceText(textReplace(process.argv[2]));
const fileStream = createReadStream("./text.txt");
const writeStream = createWriteStream("./censored.txt");
fileStream.pipe(xStream).pipe(writeStream);

function textReplace(text) {
  const replace = text.toLowerCase();
  const re = new RegExp(replace, "g");

  return ["x".repeat(text.length), re];
}

// create a censor tool.  You enter the words you want to censor
// the files are then censored
