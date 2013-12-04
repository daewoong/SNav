function ContextMenu( element, menu, contextHandler ) {
	var THIS = this
	  , contextEnabled = true;
	
	THIS.clickTarget = null;
	THIS.target = document.getElementById( element );
	THIS.menu = document.getElementById( menu );
	
	if( THIS.target ) {
		EventUtil.addHandler( THIS.target, 'contextmenu', function( e ) {
			if( contextEnabled ) {
				e = EventUtil.getEventObj( e );
				e.target = EventUtil.getEventTarget( e );

				THIS.menu.style.top = e.clientY + "px";
				THIS.menu.style.left = e.clientX + "px";
				THIS.menu.style.display = "block";
				
				THIS.clickTarget = e.target;
				
				if( typeof contextHandler == 'function' ) contextHandler( e );
				
				EventUtil.preventDefault( e );
			}
		});
		
		EventUtil.addHandler( document.documentElement, 'click', function( e ) {
			if( contextEnabled ) {
				THIS.menu.style.display = 'none';
			}
		});
	}
	
	THIS.EnableContextMenu = function( status ) {
		contextEnabled = status == true ? true : false;
	};
}