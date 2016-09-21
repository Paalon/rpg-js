class Style {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.main_color = options.main_color;
    this.main_alpha = options.main_alpha;
    this.frame_width = options.frame_width;
    this.frame_color = options.frame_color;
    this.frame_alpha = options.frame_alpha;
  }
}

let options = {};
let a = {};
if (options.x == undefined) a.x = 0;
else a.x = options.x;
console.log(a);
