describe("soundMoods", function() {

  beforeEach(function() {
  });

  it("should load Facebook script", function() {
    
    var facebookTag = $(function(){
      return $('script#facebook-jssdk').each(function(){
        return $(this)[0];
      });
    });
    expect(facebookTag.length).toEqual(1);
  });

  it("should load Facebook's root element", function(){

    var fbroot = $(function(){
      return $('#fb-root').each(function(){
        return $(this)[0];
      });
    });

    expect(fbroot.length).toEqual(1);

  });
});
