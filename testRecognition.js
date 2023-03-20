Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.games.Screen.js");
Activity.importScript(Lourah.jsFramework.dir() + '/Lourah.shape.recognition.js');
Activity.importScript(Lourah.jsFramework.dir() + '/DrawPad.js');


Activity.setTitle("Test Recognition");
var screen = new Lourah.android.games.Screen(Activity);
var pBackground = new Lourah.android.games.Screen.Pane();
pBackground.setFrame(0,0, screen.getWidth(), screen.getHeight());

pBackground.setHandler((pane) => {
    var canvas = pane.getCanvas();
    canvas.drawColor(_p(android.graphics.Color.GREEN));
    pane.flush();
    }
  );


var paint = new android.graphics.Paint();
paint.setColor(_p(android.graphics.Color.BLACK));
paint.setStyle(android.graphics.Paint.Style.STROKE);
paint.setStrokeWidth(1);

var paintCheck = new android.graphics.Paint();
paintCheck.setColor(_p(android.graphics.Color.BLUE));
paintCheck.setStyle(android.graphics.Paint.Style.STROKE);
paintCheck.setStrokeWidth(3);


var padding = 150;
var btHeight = 130;

function Control(drawPad, x, y) {

  var b = new Lourah.android.games.Screen.Pane(android.widget.Button);
  b.setFrame(x, y, screen.getWidth(), btHeight);
  screen.addPane(b);
  b.getView().setText("Scan ...");
  b.getView().setOnClickListener({
      onClick: (v) => {
        try {
          console.log("clicked");
          var scan = Lourah.shape.recognition.scan(
            drawPad.getPad().getView().getDrawable().getBitmap()
            ,4
            );
          console.log("scan.P::" + scan.P.length);
          console.log("G::[" + scan.G + "]");
          console.log("R::" + scan.R);
          var canvas = drawPad.getPad().getCanvas();
          //canvas.drawCircle(scan.G[0], scan.G[1], 5, paintCheck);
          //canvas.drawCircle(scan.G[0], scan.G[1], scan.R, paintCheck);
          var p = scan.P[0];
          var k = 100/scan.R;
          for(var i = 1; i < scan.P.length; i++) {
            canvas.drawLine(
              200+k*p[0]
              , 200+k*p[1]
              , 200+k*scan.P[i][0]
              , 200+k*scan.P[i][1],
               paintCheck);
            p = scan.P[i];
            }
          } catch(e) {
          console.log("b::error::" + e + "::" + e.stack);
          }
        }
      });
  }



var pReference = new DrawPad(paint);
pReference.getPad().setFrame(0,padding, screen.getWidth(), screen.getHeight()/3 - padding);
pReference.getPad().setHandler((pane) => {
    pane.setOnTouchListener(pReference.onTouchListener);
    var canvas = pane.getCanvas();
    canvas.drawColor(_p(android.graphics.Color.WHITE));
    pane.flush();
    }
  );



var pTest = new DrawPad(paint);
pTest.getPad().setFrame(0,screen.getHeight()/3 + padding, screen.getWidth(), screen.getHeight()/3 - padding);
pTest.getPad().setHandler((pane) => {
    var canvas = pane.getCanvas();
    pane.setOnTouchListener(pTest.onTouchListener);
    canvas.drawColor(_p(android.graphics.Color.WHITE));
    pane.flush();
    }
  );


screen.addPane(pBackground);
screen.addPane(pReference.getPad());
screen.addPane(pTest.getPad());

var [b, t] = [
  new Control(pReference, 0, 10)
  , new Control(pTest, 0, screen.getHeight()/3 + 10)
  ];

Activity. setContentView(screen.getLayout());
