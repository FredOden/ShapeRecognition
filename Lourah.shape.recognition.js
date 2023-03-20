/**
Shape recognition algorithm
/**/

var Lourah = Lourah || {};
var _p = android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.O?(c) => c:android.graphics.Color.pack;

(function () {
    
    Lourah.shape = Lourah.shape || {};
    if (Lourah.shape.recognition) return;
    
    Lourah.shape.recognition = {
      version : "0.0.1"
      };
    
    function isBorderTrivial(iColor) {
      return iColor !== -1;
      }

    var isBorder = isBorderTrivial;

    function scan(bitmap, res) {
      var s = [];
      for (var x = 0; x < bitmap.getWidth(); x+=res) {
        for(var y = 0; y < bitmap.getHeight(); y+=res) {
          var iPixelColor = bitmap.getPixel(x, y);
          if (isBorder(iPixelColor)) {
            s.push([x, y]);
            }
          }
        }
      var G = s[0];
      for (var i = 1; i < s.length; i++) {
	      G[0] += s[i][0];
	      G[1] += s[i][1];
	      /*
        G = [
          (s[i][0] + G[0])/2
          ,(s[i][1] + G[1])/2
          ];
	      /**/
        }
	    G[0] = G[0]/s.length;
	    G[1] = G[1]/s.length;
      var rhos = [];
      for (i = 0; i < s.length; i++) {
        s[i] = [
          s[i][0] - G[0]
          , s[i][1] - G[1]
          ];
        rhos.push(Math.sqrt(
            s[i][0] * s[i][0]
            + s[i][1] * s[i][1]
            ));
        }
      var mRhos = 0;
      for (i = 0; i < rhos.length; i++) {
        mRhos += rhos[i];
        }
      mRhos = mRhos / rhos.length;
      return {
        P: s       // set of points
        , G: G     // Barycentre
        , R: mRhos // mean distance from G
        }
      }
    
    Lourah.shape.recognition.scan = scan;
    
    })();
