var gsm = {
  "gsm": {
    "scan1": [
      "AT OK",
      "AT+CSMINS? +CSMINS: 0,1  OK",
      "AT+CREG? +CREG: 0,1  OK",
      "AT+CENG=3 OK",
      "AT+COPS=? +COPS: (2,\"IDEA Cellular Limited\",\"IDEA\",\"40422\"),(3,\"BPL USWEST (Maharastra)\",\"BPL MO\",\"40427\"),(3,\"AirTel\",\"AirTel\",\"40490\"),(1,\"Maharashtra\",\"CellOne\",\"40466\"),(3,\"405929\",\"405929\",\"405929\"),,(0-4),(0-2)  OK",
      "AT+CSQ +CSQ: 19,0  OK",
      "AT+CENG? +CENG: 3,0  +CENG: 0,\"404,22,278d,206d,25,37\" +CENG: 1,\"404,22,278d,3663,46,28\" +CENG: 2,\"404,22,278d,3112,08,20\" +CENG: 3,\"404,22,278d,1505,29,19\" +CENG: 4,\"404,22,278d,206e,19,17\" +CENG: 5,\"404,22,278d,04c6,32,16\" +CENG: 6,\"404,22,278d,3661,53,15\"  OK"
    ]
  }
}
const gsmParser = require('./parseGSM');
gsmParser.getPostion(gsm, (position) => {
  console.log(position);
})
