// Generated by CoffeeScript 1.6.3
(function() {
  describe('Video', function() {
    var metadata;
    metadata = void 0;
    beforeEach(function() {
      loadFixtures('video.html');
      jasmine.stubRequests();
      this.slowerSpeedYoutubeId = 'slowerSpeedYoutubeId';
      this.normalSpeedYoutubeId = 'normalSpeedYoutubeId';
      return metadata = {
        slowerSpeedYoutubeId: {
          id: this.slowerSpeedYoutubeId,
          duration: 300
        },
        normalSpeedYoutubeId: {
          id: this.normalSpeedYoutubeId,
          duration: 200
        }
      };
    });
    afterEach(function() {
      window.player = void 0;
      return window.onYouTubePlayerAPIReady = void 0;
    });
    describe('constructor', function() {
      beforeEach(function() {
        this.stubVideoPlayer = jasmine.createSpy('VideoPlayer');
        $.cookie.andReturn('0.75');
        return window.player = void 0;
      });
      describe('by default', function() {
        beforeEach(function() {
          spyOn(window.Video.prototype, 'fetchMetadata').andCallFake(function() {
            return this.metadata = metadata;
          });
          return this.video = new Video('#example');
        });
        it('reset the current video player', function() {
          return expect(window.player).toBeNull();
        });
        it('set the elements', function() {
          return expect(this.video.el).toBe('#video_id');
        });
        it('parse the videos', function() {
          return expect(this.video.videos).toEqual({
            '0.75': this.slowerSpeedYoutubeId,
            '1.0': this.normalSpeedYoutubeId
          });
        });
        it('fetch the video metadata', function() {
          expect(this.video.fetchMetadata).toHaveBeenCalled;
          return expect(this.video.metadata).toEqual(metadata);
        });
        it('parse available video speeds', function() {
          return expect(this.video.speeds).toEqual(['0.75', '1.0']);
        });
        it('set current video speed via cookie', function() {
          return expect(this.video.speed).toEqual('0.75');
        });
        return it('store a reference for this video player in the element', function() {
          return expect($('.video').data('video')).toEqual(this.video);
        });
      });
      describe('when the Youtube API is already available', function() {
        beforeEach(function() {
          this.originalYT = window.YT;
          window.YT = {
            Player: true
          };
          spyOn(window, 'VideoPlayer').andReturn(this.stubVideoPlayer);
          return this.video = new Video('#example');
        });
        afterEach(function() {
          return window.YT = this.originalYT;
        });
        return it('create the Video Player', function() {
          expect(window.VideoPlayer).toHaveBeenCalledWith({
            video: this.video
          });
          return expect(this.video.player).toEqual(this.stubVideoPlayer);
        });
      });
      describe('when the Youtube API is not ready', function() {
        beforeEach(function() {
          this.originalYT = window.YT;
          window.YT = {};
          return this.video = new Video('#example');
        });
        afterEach(function() {
          return window.YT = this.originalYT;
        });
        return it('set the callback on the window object', function() {
          return expect(window.onYouTubePlayerAPIReady).toEqual(jasmine.any(Function));
        });
      });
      return describe('when the Youtube API becoming ready', function() {
        beforeEach(function() {
          this.originalYT = window.YT;
          window.YT = {};
          spyOn(window, 'VideoPlayer').andReturn(this.stubVideoPlayer);
          this.video = new Video('#example');
          return window.onYouTubePlayerAPIReady();
        });
        afterEach(function() {
          return window.YT = this.originalYT;
        });
        return it('create the Video Player for all video elements', function() {
          expect(window.VideoPlayer).toHaveBeenCalledWith({
            video: this.video
          });
          return expect(this.video.player).toEqual(this.stubVideoPlayer);
        });
      });
    });
    describe('youtubeId', function() {
      beforeEach(function() {
        $.cookie.andReturn('1.0');
        return this.video = new Video('#example');
      });
      describe('with speed', function() {
        return it('return the video id for given speed', function() {
          expect(this.video.youtubeId('0.75')).toEqual(this.slowerSpeedYoutubeId);
          return expect(this.video.youtubeId('1.0')).toEqual(this.normalSpeedYoutubeId);
        });
      });
      return describe('without speed', function() {
        return it('return the video id for current speed', function() {
          return expect(this.video.youtubeId()).toEqual(this.normalSpeedYoutubeId);
        });
      });
    });
    describe('setSpeed', function() {
      beforeEach(function() {
        return this.video = new Video('#example');
      });
      describe('when new speed is available', function() {
        beforeEach(function() {
          return this.video.setSpeed('0.75');
        });
        it('set new speed', function() {
          return expect(this.video.speed).toEqual('0.75');
        });
        return it('save setting for new speed', function() {
          return expect($.cookie).toHaveBeenCalledWith('video_speed', '0.75', {
            expires: 3650,
            path: '/'
          });
        });
      });
      return describe('when new speed is not available', function() {
        beforeEach(function() {
          return this.video.setSpeed('1.75');
        });
        return it('set speed to 1.0x', function() {
          return expect(this.video.speed).toEqual('1.0');
        });
      });
    });
    describe('getDuration', function() {
      beforeEach(function() {
        return this.video = new Video('#example');
      });
      return it('return duration for current video', function() {
        return expect(this.video.getDuration()).toEqual(200);
      });
    });
    return describe('log', function() {
      beforeEach(function() {
        this.video = new Video('#example');
        this.video.setSpeed('1.0');
        spyOn(Logger, 'log');
        this.video.player = {
          currentTime: 25
        };
        return this.video.log('someEvent');
      });
      return it('call the logger with valid parameters', function() {
        return expect(Logger.log).toHaveBeenCalledWith('someEvent', {
          id: 'id',
          code: this.normalSpeedYoutubeId,
          currentTime: 25,
          speed: '1.0'
        });
      });
    });
  });

}).call(this);
