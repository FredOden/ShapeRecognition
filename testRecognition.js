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
paintCheck.setStrokeWidth(1);

var paintPolarb = new android.graphics.Paint();
paintPolarb.setColor(_p(android.graphics.Color.MAGENTA));
paintPolarb.setStyle(android.graphics.Paint.Style.STROKE);
paintPolarb.setStrokeWidth(5);
var paintPolart = new android.graphics.Paint();
paintPolart.setColor(_p(android.graphics.Color.YELLOW));
paintPolart.setStyle(android.graphics.Paint.Style.STROKE);
paintPolart.setStrokeWidth(5);

var paintResult = new android.graphics.Paint();
paintResult.setColor(_p(android.graphics.Color.RED));
paintResult.setStyle(android.graphics.Paint.Style.FILL);
paintResult.setTextSize(42);
paintResult.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
//paintResult.setStrokeWidth(3);

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

var interval = new Lourah.utils.math.interpolation.Interval(
  0
  , 360
  , 15
  );


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
        var delta = 0;
        
        //console.log(t.polar[t.polar.length-1]);
        
        var [bm, tm] = [0, 0];
        
        for(var i = 0; i < bc.length; i++) {
          bm += bc[i][1];
          tm += tc[i][1];
          }
        bm = bm/bc.length;
        tm = tm/tc.length;
        
        var [sbt, sb, st, sd] = [0, 0, 0, 0];
        
        for(var i = 0; i < bc.length; i++) {
          var [bi, ti, di] = [
            (bc[i][1] - bm)
            , (tc[i][1] - tm)
            , Math.abs(bc[i][1] - tc[i][1])
            ];
          sbt += bi*ti;
          sb += bi*bi;
          st += ti*ti;
          sd += di*di;
          }

        var stat;
        console.log(
          stat = "sbt::" + sbt.toFixed(2)
          + ", sb::" + Math.sqrt(sb).toFixed(2)
          + ", st::" + Math.sqrt(st).toFixed(2)
          + ", sd::" + Math.sqrt(sd).toFixed(2)
          + ", bm::" + bm.toFixed(2)
          + ", tm::" + tm.toFixed(2)
          );
        
        delta = sbt/(Math.sqrt(sb)*Math.sqrt(st)*Math.sqrt(sd));

        console.log("delta::" + delta.toFixed(2));
        var canvas = pResult.getCanvas();
        var toX = p => p[0]*2.5 + 50;
        var toY = p => 400 - p[1]*200;
        for(i = 0; i < bc.length; i++) {
          if (i===0) continue;
          canvas.drawLine(
            toX(bc[i-1])
            , toY(bc[i-1])
            , toX(bc[i])
            , toY(bc[i])
            , paintPolarb
            );
          canvas.drawLine(
            toX(tc[i-1])
            , toY(tc[i-1])
            , toX(tc[i])
            , toY(tc[i])
            , paintPolart
            );
          }
        canvas.drawText("delta::" + delta.toFixed(2), 100, 50, paintResult);
        canvas.drawText(stat, 100, 400, paintResult);
        /**/
        } catch (e) {
        console.log("Compare::" + e + "::" + e.stack);
        }
      }
    }
  )

Activity. setContentView(screen.getLayout());
