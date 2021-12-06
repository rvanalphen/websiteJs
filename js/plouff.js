let canvas;

//for map
let inputmap;
let img;
let mapwest = 534391.823571;
let mapeast = 536335.716515;
let mapsouth = 4067707.78834;
let mapnorth = 4070439.15604;

//for the map position
let pixelwest = 50;
let pixelnorth = 50;
let pixeleast = 450;
let pixelsouth = 550;

//handle map scale
let map_xscale = (mapeast - mapwest) / pixeleast;
let map_yscale = (mapnorth - mapsouth) / pixelsouth;

//for N-S profile
let inputprofile;
let pronorthing = [];
let proeasting = [];
let promagnetic = [];
let calcmag = [];

let prototal; //how many points are in the profile
let minoroverBox = [];
//for polygon

//create an array of corner objects
var corner = [];

//location of corner object
//these are global so mouse state can be checked

//xcorner and ycorner are in pixels
var xcorner = [];
var ycorner = [];

var minorxcorner = [];
var minorycorner = [];

//utmxcorner and utm ycorner are in UTM
var utmxcorner = [];
var utmycorner = [];
//number of corner objects
var num_corners;
var num_corners2;

var maginc;
var magdec;
var magmag;
var earthinc;
var earthdec;
var depthtop;
var depthbottom;

//keep track of mouse state for each corner object
//these are global so mouse state can be checked
var locked = [];
var minorlocked = [];
var overBox = [];

preEast = [];
preNorth = [];
preMag = [];

function preload() {
  profile9 = loadTable("/dist/js/Line_9_det_mod.in", "csv", "header");
  profile56A = loadTable("/dist/js/Line_56_det_A_mod.in", "csv", "header");
}

function setup() {
  canvas = createCanvas(1500, 650);
  canvas.parent("sketch5");

  img = createImg("/dist/images/MagneticMap.png", "");
  img.hide();

  inputprofilebutton1 = createButton("Profile 1");
  inputprofilebutton1.position(530, 30);
  inputprofilebutton1.mousePressed(handleProfile1);
  inputprofilebutton1.parent("sketch5");

  inputprofilebutton1 = createButton("Profile 2");
  inputprofilebutton1.position(630, 30);
  inputprofilebutton1.mousePressed(handleProfile2);
  inputprofilebutton1.parent("sketch5");

  // inputprofilebutton1 = createButton("Profile 3");
  // inputprofilebutton1.position(730, 30);
  // inputprofilebutton1.mousePressed(handleProfile3);
  // inputprofilebutton1.parent("sketch5");

  // inputprofilebutton1 = createButton("Profile 4");
  // inputprofilebutton1.position(830, 30);
  // inputprofilebutton1.mousePressed(handleProfile4);
  // inputprofilebutton1.parent("sketch5");

  // inputprofilebutton1 = createButton("Profile 5");
  // inputprofilebutton1.position(930, 30);
  // inputprofilebutton1.mousePressed(handleProfile5);
  // inputprofilebutton1.parent("sketch5");

  // inputprofilebutton1 = createButton("Profile 6");
  // inputprofilebutton1.position(1030, 30);
  // inputprofilebutton1.mousePressed(handleProfile6);
  // inputprofilebutton1.parent("sketch5");

  savebutton = createButton("SAVE Model Data");
  savebutton.position(630, 350);
  savebutton.mousePressed(createFile);
  savebutton.parent("sketch5");

  inputprofilebutton1 = createButton("Reset");
  inputprofilebutton1.position(930, 350);
  inputprofilebutton1.mousePressed(resetShape);
  inputprofilebutton1.parent("sketch5");

  //initialize polygon
  //specify number and intial location of polygon corners
  num_corners = 4;
  xcorner[0] = 100;
  ycorner[0] = 250;
  xcorner[1] = 300;
  ycorner[1] = 400;
  xcorner[2] = 200;
  ycorner[2] = 400;
  xcorner[3] = 100;
  ycorner[3] = 350;

  //create corner objects and initialize mouse state for each corner
  for (i = 0; i < num_corners; i++) {
    corner[i] = new CornerVertex();
    overBox[i] = false;
    locked[i] = false;
  }
  //initialize magnetization values

  header = createElement("h2", "Adjust model parameters");
  header.position(1150, 0);
  header.parent("sketch5");
  p1 = createP("Depth to top of polygon (meters):");
  p1.position(1150, 50);
  p1.parent("sketch5");
  depthtop = createInput();
  depthtop.position(1150, 100);
  depthtop.value(40);
  depthtop.parent("sketch5");

  p2 = createP("Depth to bottom of polygon (meters):");
  p2.position(1150, 125);
  p2.parent("sketch5");
  depthbottom = createInput();
  depthbottom.position(1150, 175);
  depthbottom.value(50);
  depthbottom.parent("sketch5");

  p3 = createP("Magnetic dipole inclination (decimal degrees):");
  p3.position(1150, 200);
  p3.parent("sketch5");
  maginc = createInput();
  maginc.position(1150, 250);
  maginc.value(-67);
  maginc.parent("sketch5");

  p3 = createP("Magnetic dipole declination (decimal degrees):");
  p3.position(1150, 275);
  p3.parent("sketch5");
  magdec = createInput();
  magdec.position(1150, 325);
  magdec.value(177);
  magdec.parent("sketch5");

  p4 = createP("Intensity of magnetization (amp/m):");
  p4.position(1150, 350);
  p4.parent("sketch5");
  magmag = createInput();
  magmag.position(1150, 400);
  magmag.value(1);
  magmag.parent("sketch5");

  p5 = createP("Earth field magnetic inclination (decimal degrees):");
  p5.position(1150, 425);
  p5.parent("sketch5");
  earthinc = createInput();
  earthinc.position(1150, 475);
  earthinc.value(62);
  earthinc.parent("sketch5");

  p6 = createP("Earth field magnetic declination(decimal degrees):");
  p6.position(1150, 500);
  p6.parent("sketch5");

  earthdec = createInput();
  earthdec.position(1150, 550);
  earthdec.value(12);
  earthdec.parent("sketch5");
}

function draw() {
  background(68);

  //handle map

  if (img) {
    image(img, pixelwest, pixelnorth, pixeleast, pixelsouth);
  }

  fill(255);
  //handle profile
  for (i = 0; i <= prototal; i++) {
    prox =
      550 +
      (500 * (pronorthing[i] - min(pronorthing))) /
        (max(pronorthing) - min(pronorthing));
    proy =
      300 -
      (200 * (promagnetic[i] - min(promagnetic))) /
        (max(promagnetic) - min(promagnetic));

    ellipse(prox, proy, 5, 5);

    //plot profile points on map
    mapx =
      pixelwest + (pixeleast * (proeasting[i] - mapwest)) / (mapeast - mapwest);
    mapy =
      pixelnorth +
      pixelsouth -
      (pixelsouth * (pronorthing[i] - mapsouth)) / (mapnorth - mapsouth);

    ellipse(mapx, mapy, 5, 5);
  }

  //plot corners
  for (i = 0; i < num_corners; i++) {
    corner[i].move();
    corner[i].display();
    corner[i].pixelUTM();
    corner[i].minorPoints();
  }

  //add corners
  for (i = 0; i < num_corners; i++) {
    corner[i].add();
  }

  // mouseX < pixeleast+50 && mouseX > pixelwest
  if (
    mouseX < pixeleast + 50 &&
    mouseX > pixelwest &&
    mouseY > pixelnorth &&
    mouseY < pixelsouth + 50
  ) {
    fill(255);
    let mapeasting = mapwest + (mouseX - 50) * map_xscale;
    let mapnorthing = mapnorth - (mouseY - 50) * map_yscale;
    text(nfc(mapeasting, 0), 160, 20);
    text(nfc(mapnorthing, 0), 150, 35);

    text("E , UTM zone 11, WGS84", 210, 20);
    text("N , UTM zone 11, WGS84", 210, 35);
  }
  //  text(utmxcorner[0], 300,10);
  //  text(utmycorner[0], 300,30);
  //    console.log(utmycorner[0]);

  //plot profile
  fill(255, 0, 0);
  for (i = 0; i < prototal; i++) {
    calcmag[i] = calcPlouff(proeasting[i], pronorthing[i]);
    let magx =
      550 +
      (500 * (pronorthing[i] - min(pronorthing))) /
        (max(pronorthing) - min(pronorthing));
    let magy =
      300 -
      (200 * (calcmag[i] - min(promagnetic))) /
        (max(promagnetic) - min(promagnetic));
    ellipse(magx, magy, 5, 5);
  }
  //add profile labels
  fill(0);
  rect(550, 315, 500, 2);
  xrange = max(pronorthing) - min(pronorthing);
  text(xrange + " m", 800, 330);

  rect(525, 100, 2, 200);
  yrange = max(promagnetic) - min(promagnetic);
  text(nfc(yrange, 0) + " nT", 530, 100);
  text("S", 550, 330);
  text("N", 1050, 330);

  fill(255);
  ellipse(600, 445, 5, 5);
  fill(255, 0, 0);
  ellipse(600, 495, 5, 5);
  fill(0);
  text("observed magnetic anomaly", 625, 450);
  text("calculated magnetic anomaly", 625, 500);

  text("drag red polygon corners to change model geometry", 800, 450);

  text("click yellow polygon nodes to add a polygon corner", 805, 500);
}

function handleFileProfile(file) {
  //createP(file.name + " " + file.size + "  " + file.type);
  //console.log(file);

  let i = 0;
  let dataline = split(file.data, "\n");
  prototal = dataline.length - 2;

  for (i = 0; i <= prototal; i++) {
    // text(total, 400,50);
    // text(dataline[total], 300, 30);
    let datafields = split(dataline[i], " ");
    pronorthing[i] = datafields[1];
    promagnetic[i] = datafields[2];
    proeasting[i] = datafields[0];
  }
}

function resetShape() {
  clearLine();
  num_corners = 4;
  xcorner[0] = 100;
  ycorner[0] = 250;
  xcorner[1] = 300;
  ycorner[1] = 400;
  xcorner[2] = 200;
  ycorner[2] = 400;
  xcorner[3] = 100;
  ycorner[3] = 350;
}

function handleFileMap(file) {
  print(file);
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
}

//the CornerVertex object
function CornerVertex() {
  var boxsize; //boxsize controls area of mouseover and size of corner

  this.move = function () {
    // Test if the cursor is over the box

    if (
      mouseX > xcorner[i] - boxsize &&
      mouseX < xcorner[i] + boxsize &&
      mouseY > ycorner[i] - boxsize &&
      mouseY < ycorner[i] + boxsize
    ) {
      overBox[i] = true;

      if (!locked[i]) {
        //stroke(255);
        fill(153);
      }
    } else {
      //stroke(153);
      //fill(153);
      overBox[i] = false;
    }
  };

  this.add = function () {
    // Test if the cursor is over the box
    if (
      mouseX > minorxcorner[i] - boxsize &&
      mouseX < minorxcorner[i] + boxsize &&
      mouseY > minorycorner[i] - boxsize &&
      mouseY < minorycorner[i] + boxsize
    ) {
      minoroverBox[i] = true;

      if (!minorlocked[i]) {
        //stroke(255);
        fill(0, 0, 250);
      }
    } else {
      //stroke(153);
      //fill(153);
      minoroverBox[i] = false;
    }

    if (minorlocked[i] == true) {
      fill(0, 0, 255);
      ellipse(minorxcorner[i], minorycorner[i], 8, 8);
      corner[num_corners] = new CornerVertex();
      overBox[num_corners] = false;
      locked[num_corners] = false;
      for (j = num_corners; j > i + 1; j--) {
        xcorner[j] = xcorner[j - 1];
        ycorner[j] = ycorner[j - 1];
      }
      xcorner[i + 1] = minorxcorner[i];
      ycorner[i + 1] = minorycorner[i];
      num_corners++;
      minoroverBox[i] = false;
      minorlocked[i] = false;
    }
  };

  this.display = function () {
    // Draw the corner box and connecting line
    if (locked[i] == true) {
      boxsize = 12;
    } else {
      boxsize = 10;
    }
    fill("red");
    ellipse(xcorner[i], ycorner[i], boxsize, boxsize);

    if (i == num_corners - 1) {
      line(
        xcorner[num_corners - 1],
        ycorner[num_corners - 1],
        xcorner[0],
        ycorner[0]
      );
    } else {
      line(xcorner[i], ycorner[i], xcorner[i + 1], ycorner[i + 1]);
    }
  };

  this.pixelUTM = function () {
    utmxcorner[i] = mapwest + (xcorner[i] - 50) * map_xscale;
    utmycorner[i] = mapnorth - (ycorner[i] - 50) * map_yscale;
  };

  this.minorPoints = function () {
    if (i == num_corners - 1) {
      minorxcorner[i] = (xcorner[num_corners - 1] + xcorner[0]) / 2;
      minorycorner[i] = (ycorner[num_corners - 1] + ycorner[0]) / 2;
    } else {
      minorxcorner[i] = (xcorner[i] + xcorner[i + 1]) / 2;
      minorycorner[i] = (ycorner[i] + ycorner[i + 1]) / 2;
    }
    fill("yellow");
    ellipse(minorxcorner[i], minorycorner[i], 5, 5);
  };
}

function mousePressed() {
  //check the state f each corner, highlight slected corner
  for (i = 0; i < num_corners; i++) {
    if (overBox[i]) {
      locked[i] = true;
      fill(255, 0, 0);
    } else {
      locked[i] = false;
    }
  }
}

function mouseClicked() {
  for (i = 0; i < num_corners; i++) {
    if (minoroverBox[i]) {
      minorlocked[i] = true;
      fill(0, 0, 255);
    } else {
      minorlocked[i] = false;
    }
  }
}

function mouseDragged() {
  //drag the selected corner and update x,y
  for (i = 0; i < num_corners; i++) {
    if (locked[i]) {
      xcorner[i] = mouseX;
      ycorner[i] = mouseY;
    }
  }
}

function mouseReleased() {
  //no corner selected on mouse release
  for (i = 0; i < num_corners; i++) {
    locked[i] = false;
    // minorlocked[i] = false;
  }
}

function createFile() {
  // creates a file called 'newFile.txt'
  let writer = createWriter("model_data.txt");

  writer.print("Model data");
  writer.print("polygon corners (easting, northing)");
  for (i = 0; i < num_corners; i++) {
    writer.print(utmxcorner[i] + "," + utmycorner[i]);
  }

  writer.print("polygon depth");
  writer.print("depth to top (m): " + depthtop.value());
  writer.print("depth to bottom (m): " + depthbottom.value());

  writer.print("magnetic field data");
  writer.print("Earths magnetic field:");
  writer.print("Inclination (degree): " + earthinc.value());
  writer.print("Declination (degree): " + earthdec.value());
  writer.print("Magnetization:");
  writer.print("Inclination (degree): " + maginc.value());
  writer.print("Declination(degree: " + magdec.value());
  writer.print("Intensity (amp/m): " + magmag.value());

  writer.print("Skiprows for pandas:" + str(15 + num_corners));
  writer.print("profile data (easting, northing, observed, calculated)");
  for (i = 0; i < prototal; i++) {
    writer.print(
      proeasting[i] +
        "," +
        pronorthing[i] +
        "," +
        promagnetic[i] +
        "," +
        calcmag[i]
    );
  }
  // close the PrintWriter and save the file
  writer.close();
}

function calcPlouff(east, north) {
  //depth to top
  z1 = depthtop.value();
  //depth to bottom
  z2 = depthbottom.value();

  //set magnetization (amp/m)
  minc = (maginc.value() * PI) / 180; //inclination down in rad
  mdec = (magdec.value() * PI) / 180; //declination east in rad
  mi = magmag.value();

  //calculate direction cosines for magnetiation
  ml = cos(minc) * cos(mdec);
  mm = cos(minc) * sin(mdec);
  mn = sin(minc);

  //components of magnetization in x,y,z directions
  mx = mi * ml;
  my = mi * mm;
  mz = mi * mn;

  //set earths field
  einc = (earthinc.value() * PI) / 180; //inclination down in rad
  edec = (earthdec.value() * PI) / 180; //declination east in rad

  el = cos(einc) * cos(edec);
  em = cos(einc) * sin(edec);
  en = sin(einc);

  //proportionality constant is
  // magnetic permeability * 1e9
  //to convert of nT
  prop = 400 * PI;

  //px is the northing of the observation point
  //py is the easting of the observation point
  let px = north;
  let py = east;

  //set the volume integrals to zero
  //for each observation point
  v1 = 0;
  v2 = 0;
  v3 = 0;
  v4 = 0;
  v5 = 0;
  v6 = 0;

  //calculate volume integrals
  for (k = 0; k < num_corners; k++) {
    //if last side of polygon
    if (k == num_corners - 1) {
      x1 = utmycorner[k] - px;
      y1 = utmxcorner[k] - py;
      x2 = utmycorner[0] - px;
      y2 = utmxcorner[0] - py;
    } else {
      //all other polygon sides
      x1 = utmycorner[k] - px;
      y1 = utmxcorner[k] - py;
      x2 = utmycorner[k + 1] - px;
      y2 = utmxcorner[k + 1] - py;
    }

    //calculate geometry
    delta_x = x2 - x1;
    delta_y = y2 - y1;
    delta_s = sqrt(delta_x ** 2 + delta_y ** 2);

    //avoid division by zero if delta_s = 0
    // if (delta_s == 0) {delta_s = 0.1};
    c = delta_y / delta_s;
    s = delta_x / delta_s;
    p = (x1 * y2 - x2 * y1) / delta_s;

    d1 = x1 * s + y1 * c;
    d2 = x2 * s + y2 * c;

    r1sq = x1 ** 2 + y1 ** 2;
    r2sq = x2 ** 2 + y2 ** 2;
    r11 = sqrt(r1sq + z1 ** 2);
    r12 = sqrt(r1sq + z2 ** 2);
    r21 = sqrt(r2sq + z1 ** 2);
    r22 = sqrt(r2sq + z2 ** 2);

    f = log((((r22 + z2) / (r12 + z2)) * (r11 + z1)) / (r21 + z1));
    q = log((((r22 + d2) / (r12 + d1)) * (r11 + d1)) / (r21 + d2));
    w =
      atan2(z2 * d2, p * r22) -
      atan2(z2 * d1, p * r12) -
      atan2(z1 * d2, p * r21) +
      atan2(z1 * d1, p * r11);

    v1 += s * c * f - c * c * w;
    v2 += s * c * w + c * c * f;
    v3 += c * q;
    v4 += -(s * c * f + s * s * w);
    v5 += -(s * q);
    v6 += w;
  }

  //calculate the components of the magnetic field
  bx = prop * (mx * v1 + my * v2 + mz * v3);
  by = prop * (mx * v2 + my * v4 + mz * v5);
  bz = prop * (mx * v3 + my * v5 + mz * v6);

  //calculate total anomaly
  //this calculation works for anomaly << total field strength
  b_total = el * bx + em * by + en * bz;

  return b_total;
}

function clearLine() {
  pronorthing = [];
  proeasting = [];
  promagnetic = [];
  preEast = [];
  preNorth = [];
  preMag = [];
}

function handleProfile1() {
  clearLine();
  total = profile9.getRowCount() - 2;
  print(total);

  for (let i = 0; i < total; i++) {
    if (i % 5 == 0) {
      preEast.push(profile9.getColumn("Easting")[i]);
      preNorth.push(profile9.getColumn("Northing")[i]);
      preMag.push(profile9.getColumn("Mag")[i]);
    }
  }

  prototal = preMag.length - 2;
  for (let i = 0; i < prototal; i++) {
    proeasting[i] = preEast[i];
    pronorthing[i] = preNorth[i];
    promagnetic[i] = preMag[i];
  }
}

function handleProfile2() {
  clearLine();
  total = profile56A.getRowCount() - 2;

  for (let i = 0; i < total; i++) {
    if (i % 5 == 0) {
      preEast.push(profile56A.getColumn("Easting")[i]);
      preNorth.push(profile56A.getColumn("Northing")[i]);
      preMag.push(profile56A.getColumn("Mag")[i]);
    }
  }

  prototal = preMag.length - 2;
  for (let i = 0; i < prototal; i++) {
    proeasting[i] = preEast[i];
    pronorthing[i] = preNorth[i];
    promagnetic[i] = preMag[i];
  }
}

// function handleProfile3() {
//   clearLine();
//   total = profile15.getRowCount() - 2;
//   print(total);

//   for (let i = 0; i < total; i++) {
//     if (i % 5 == 0) {
//       preEast.push(profile15.getColumn("Easting")[i]);
//       preNorth.push(profile15.getColumn("Northing")[i]);
//       preMag.push(profile15.getColumn("Mag")[i]);
//     }
//   }

//   prototal = preMag.length - 2;
//   for (let i = 0; i < prototal; i++) {
//     proeasting[i] = preEast[i];
//     pronorthing[i] = preNorth[i];
//     promagnetic[i] = preMag[i];
//   }
// }

// function handleProfile4() {
//   clearLine();
//   total = profile20.getRowCount() - 2;
//   print(total);

//   for (let i = 0; i < total; i++) {
//     if (i % 5 == 0) {
//       preEast.push(profile20.getColumn("Easting")[i]);
//       preNorth.push(profile20.getColumn("Northing")[i]);
//       preMag.push(profile20.getColumn("Mag")[i]);
//     }
//   }

//   prototal = preMag.length - 2;
//   for (let i = 0; i < prototal; i++) {
//     proeasting[i] = preEast[i];
//     pronorthing[i] = preNorth[i];
//     promagnetic[i] = preMag[i];
//   }
// }

// function handleProfile5() {
//   clearLine();
//   total = profile45.getRowCount() - 2;
//   print(total);

//   for (let i = 0; i < total; i++) {
//     if (i % 5 == 0) {
//       preEast.push(profile45.getColumn("Easting")[i]);
//       preNorth.push(profile45.getColumn("Northing")[i]);
//       preMag.push(profile45.getColumn("Mag")[i]);
//     }
//   }

//   prototal = preMag.length - 2;
//   for (let i = 0; i < prototal; i++) {
//     proeasting[i] = preEast[i];
//     pronorthing[i] = preNorth[i];
//     promagnetic[i] = preMag[i];
//   }
// }

// function handleProfile6() {
//   clearLine();
//   total = profile56A.getRowCount() - 2;
//   print(total);

//   for (let i = 0; i < total; i++) {
//     if (i % 5 == 0) {
//       preEast.push(profile56A.getColumn("Easting")[i]);
//       preNorth.push(profile56A.getColumn("Northing")[i]);
//       preMag.push(profile56A.getColumn("Mag")[i]);
//     }
//   }

//   prototal = preMag.length - 2;
//   for (let i = 0; i < prototal; i++) {
//     proeasting[i] = preEast[i];
//     pronorthing[i] = preNorth[i];
//     promagnetic[i] = preMag[i];
//   }
// }
