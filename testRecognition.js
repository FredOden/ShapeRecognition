Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.games.Screen.js");
Activity.importScript(Lourah.jsFramework.dir() + '/Lourah.shape.recognition.js');
Activity.importScript(Lourah.jsFramework.dir() + '/DrawPad.js');
Activity.importScript(Lourah.jsFramework.dir() + '/Lourah.utils.math.interpolation.js');


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

var pResult = new Lourah.android.games.Screen.Pane();
pResult.setFrame(0, 2*screen.getHeight()/3 + 1*padding, screen.getWidth(), screen.getHeight()/3 - 2 * padding);
pResult.setHandler((pane) => {
    var canvas = pane.getCanvas();
    canvas.drawColor(_p(android.graphics.Color.LTGRAY));
    pane.flush();
    }
  );

var interval = new Lourah.utils.math.interpolation.Interval(0, 360, 1);


function Control(drawPad, x, y) {
  this.polar = [];
  var b = new Lourah.android.games.Screen.Pane(android.widget.Button);
  b.setFrame(x, y, screen.getWidth(), btHeight);
  screen.addPane(b);
  b.getView().setText("Scan ...");
  b.getView().setOnClickListener({
      onClick: (v) => {
        try {
          //console.log("clicked");
          var scan = Lourah.shape.recognition.scan(
            drawPad.getPad().getView().getDrawable().getBitmap()
            ,4
            );
          //console.log("scan.P::" + scan.P.length);
          //console.log("G::[" + scan.G + "]");
          //console.log("R::" + scan.R);
          this.polar = scan.Polar;
          var canvas = pResult.getCanvas();
          //canvas.drawCircle(scan.G[0], scan.G[1], 5, paintCheck);
          canvas.drawCircle(
            canvas.getWidth()/2
            , canvas.getHeight()/2
            , 200, paintCheck);
          var p = scan.P[0];
          var k = 200/scan.R;
          for(var i = 1; i < scan.P.length; i++) {
            canvas.drawLine(
              canvas.getWidth()/2+k*p[0]
              , canvas.getHeight()/2+k*p[1]
              , canvas.getWidth()/2+k*scan.P[i][0]
              , canvas.getHeight()/2+k*scan.P[i][1],
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



bCompare = new Lourah.android.games.Screen.Pane(android.widget.Button);
bCompare.setFrame(0, 2*screen.getHeight()/3 + 10, screen.getWidth()/2, btHeight);
bClear = new Lourah.android.games.Screen.Pane(android.widget.Button);
bClear.setFrame(screen.getWidth()/2, 2*screen.getHeight()/3 + 10, screen.getWidth()/2, btHeight);

screen.addPane(bCompare);
screen.addPane(bClear);

bCompare.getView().setText("Compare...");
bClear.getView().setText("Clear");

bClear.getView().setOnClickListener({
    onClick: v => {
      try {
        pResult.getCanvas().drawColor(_p(android.graphics.Color.LTGRAY));
        pResult.flush();
        //pReference.getPad().getCanvas().drawColor(_p(android.graphics.Color.WHITE));
        //pReference.getPad().flush();
        pTest.getPad().getCanvas().drawColor(_p(android.graphics.Color.WHITE));
        pTest.getPad().flush();
        } catch(e) {
        console.log("bClear::" + e);
        }
      }
    });


screen.addPane(pBackground);
screen.addPane(pReference.getPad());
screen.addPane(pTest.getPad());
screen.addPane(pResult);

var [b, t] = [
  new Control(pReference, 0, 10)
  , new Control(pTest, 0, screen.getHeight()/3 + 10)
  ];

bCompare.getView().setOnClickListener({
    onClick: v => {
      try {
        //console.log("b.polar.length::" + b.polar.length);
        //console.log("t.polar.length::" + t.polar.length);
        var [bc, tc] = [
          interval.apply(b.polar)
          , interval.apply(t.polar)
          ];
        delta = 0;
        //console.log("bc.length::" + bc.length);
        //console.log("tc.length::" + tc.length);
        
        for(var i = 0; i < bc.length; i++) {
          delta += (bc[i][1] - tc[i][1]);
          /*
          console.log(
            bc[i][0] + "::" + tc[i][0]
            + ", " + bc[i][1] + "::" + tc[i][1]
            + " => " + delta
            );
          /**/
          }
        console.log("delta::" + delta/bc.length);
        /**/
        } catch (e) {
        console.log("Compare::" + e + "::" + e.stack);
        }
      }
    }
  )

Activity. setContentView(screen.getLayout());
