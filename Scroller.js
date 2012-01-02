// a simple scrolling class, which needs some tuning
function Scroller(nme)
  {
    this.id = name || '$SCREEN';
    this.scrollTimer = null;
    this.scrollSpeed = 20;
    this.scrollPathX = new Array();
    this.scrollPathY = new Array();
    this.targX = 0;
    this.targY = 0;
    this.curX = 0;
    this.curY = 0;
    this.fineX = 0;
    this.fineY = 0;
    this.fineScrollSpeed = 20;
    this.fineScrollStep = 2;
    this.fineScrollTimer = setInterval(this.id + ".FineScroll()",this.fineScrollSpeed);
    this.tempEasing = '';
    this.easing = ''; 
//-------------------------------------------------- SetFactor
    this.SetFactor = function(fct)
      {
        this.factor = fct || .02;
        return;
      }
//-------------------------------------------------- SetBounding
    this.SetBounding = function(ll,tt,rb,bb)
      {
        this.leftBoundary = ll || 0;
        this.topBoundary = tt || 0;
        this.rightBoundary = rb || 0;
        this.bottomBoundary = bb || 0;
        return;
      }
//-------------------------------------------------- SetEasing
    this.SetEasing = function(ea)
      {
        this.easing
          = (ea == 'start') ? 'start'
          : (ea == 'end') ? 'end'
          : (ea == 'none') ? 'none'
          : (typeof(ea) == 'number') ? ea
          : null;
        return;
      }
//-------------------------------------------------- runPath
//
// because netscape requires scrollbars on any frame which tries to use
// the window.scrollTo method, layer positioning of SCRLAYER is used instead.
// note the manner in which the scroll path is precalculated in MoveTo()
// for netscape.  this method runs through that path, using a timer.
//
    this.RunPath = function(stp)
      {
        clearTimeout(this.scrollTimer);
        if(this.scrollPathX[stp])
          {
            document.SCRLAYER.left = -this.scrollPathX[stp]; 
            document.SCRLAYER.top = -this.scrollPathY[stp];
            setTimeout(this.id + ".RunPath(" + (++stp) + ")",this.scrollSpeed);
          }
        else { this.EndScroll(); }
        return;
      }
//---------------------------------------------------- endScroll
    this.EndScroll = function()
      {
        this.scrollOn = false;
        return false;
      }
//---------------------------------------------------- SetFineScroll
    this.SetFineScroll = function(xDir,yDir)
      {
        this.fineX = xDir;
        this.fineY = yDir;
        return;
      }
//---------------------------------------------------- ClearFineScroll
    this.ClearFineScroll = function()
      {
        this.fineX = null;
        this.fineY = null;
        return;
      }
//---------------------------------------------------- FineScroll
    this.FineScroll = function()
      {
        if(!this.scrollOn && (this.fineX || this.fineY))
          {
            if(
               ((this.curX + this.fineX) > this.leftBoundary)
            && ((this.curX + this.fineX) < this.rightBoundary)
            && ((this.curY + this.fineY) > this.topBoundary)
            && ((this.curY + this.fineY) < this.bottomBoundary)
              )
              { 
                this.tempEasing = this.easing;
                this.SetEasing('none');
                this.MoveTo(this.curX + this.fineX,this.curY + this.fineY);
                this.SetEasing(this.tempEasing);
              }
          }
        return;
      }
//---------------------------------------------------- MoveTo
    this.MoveTo = function(targX,targY)
      {
        if(!this.scrollOn)
          {
            this.scrollOn = true;
            // kill further events in IE (to avoid a disrupting focus, etc.)
            if(document.all && window.event)
              {
                window.event.cancelBubble = true;
                window.event.returnValue = false;
              }

            this.targX = targX || 1;
            this.targY = targY || 1;

            // clean up any current scrolling information
            clearTimeout(this.scrollTimer);
            this.scrollPathX = new Array();
            this.scrollPathY = new Array();

            var V = ((this.targX - this.curX) == 0); // check for vertical
            var S = (V) ? 0 : (this.targY - this.curY) / (this.targX - this.curX); 
            var Y = this.curY - (S * this.curX);

            while((this.curY != this.targY) || (this.curX != this.targX))
              {
                var ST
                  = (this.easing == 'start') ? ST + (ST * this.factor)
                  : (this.easing == 'end') ? (V) ? Math.ceil(((this.targY > this.curY) ? this.targY - this.curY : this.curY - this.targY)*this.factor) : Math.ceil(((this.targX > this.curX) ? this.targX - this.curX : this.curX - this.targX)*this.factor)
                  // for 'none', just an arbitrarily large number to go well past
                  // final position, and cause an immediate jump to final position
                  : (this.easing == 'none') ? (V) ? 100000 * this.targY+1 : 100000 * this.targX+1 
                  : (typeof(this.easing) == 'number') ? this.easing
                  : this.fineScrollStep;

                if(V)
                  {
                    this.curX = this.targX;
                    this.curY = (this.targY < this.curY) ? Math.max(this.curY - ST,this.targY) : Math.min(this.curY + ST,this.targY); 
                  }
                else
                  {
                    this.curX = (this.targX < this.curX) ? Math.max(this.curX - ST,this.targX) : Math.min(this.curX + ST,this.targX); 
                    this.curY = Math.round(Y + (S * this.curX));
                  }

                // if IE, use window.scrollTo; if NS, store path and run it
                // afterwards through RunPath().
                if(document.all) { window.scrollTo(this.curX,this.curY); }
                else
                  {
                    this.scrollPathX[this.scrollPathX.length] = this.curX;
                    this.scrollPathY[this.scrollPathY.length] = this.curY;
                  }
status = this.curX + ' - ' + this.curY;
              }
            this.RunPath(0);
            return;
          }
       }
    return;
  }

