describe("soundMoods", function() {

  beforeEach(module('soundMoods'));

  describe('moods', function(){
    it('should populate with mood models or an empty string', inject(function(Mood){
      var moods = Mood;
      for(var mood in moods){
        if(mood == ''){
          expect(mood).toEqual('');
        }else {
          expect(mood).toBeDefined();
        }
      }
    }))
  })

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
