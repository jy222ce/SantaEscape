Function.prototype.member = function (name, value) {
    this.prototype[name] = value
}

//////// Game Definition
function Game() { }
Game.start = function (room, welcome) {
    game.start(room.id)
    printMessage(welcome)
}
Game.end = function (msg) {
    playSound("fanfare.wav")
    game.setClearMessage(msg)
    game.clear()
}
Game.over = function (msg) {
    game.setGameoverMessage(msg)
    game.gameover()
}
Game.move = function (room) {
    game.move(room.id)
}
Game.handItem = function () {
    return game.getHandItem()
}
Game.combination = function (object1, object2, object3) {
    game.makeCombination(object1.id, object2.id, object3.id)
}

//////// Room Definition

function Room(name, background) {
    this.name = name
    this.background = background
    this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function (intensity) {
    this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image) {
    this.room = room
    this.name = name
    this.image = image

    if (room !== undefined) {
        this.id = room.id.createObject(name, image)
    }
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function (image) {
    this.image = image
    this.id.setSprite(image)
})
Object.member('resize', function (width) {
    this.id.setWidth(width)
})
Object.member('setDescription', function (description) {
    this.id.setItemDescription(description)
})

Object.member('getX', function () {
    return this.id.getX()
})
Object.member('getY', function () {
    return this.id.getY()
})
Object.member('locate', function (x, y) {
    this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function (x, y) {
    this.id.moveX(x)
    this.id.moveY(y)
})

Object.member('show', function () {
    this.id.show()
})
Object.member('hide', function () {
    this.id.hide()
})
Object.member('open', function () {
    this.id.open()
})
Object.member('close', function () {
    this.id.close()
})
Object.member('lock', function () {
    this.id.lock()
})
Object.member('unlock', function () {
    this.id.unlock()
})
Object.member('isOpened', function () {
    return this.id.isOpened()
})
Object.member('isClosed', function () {
    return this.id.isClosed()
})
Object.member('isLocked', function () {
    return this.id.isLocked()
})
Object.member('pick', function () {
    this.id.pick()
})
Object.member('isPicked', function () {
    return this.id.isPicked()
})
Object.member('isHanded', function () {
    return Game.handItem() == this.id
})


//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo) {
    Object.call(this, room, name, closedImage)

    // Door properties
    this.closedImage = closedImage
    this.openedImage = openedImage
    this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function () {
    if (!this.id.isLocked() && this.id.isClosed()) {
        this.id.open()
    }
    else if (this.id.isOpened()) {
        if (this.connectedTo !== undefined) {
            Game.move(this.connectedTo)
        }
        else {
            Game.end()
        }
    }
})
Door.member('onOpen', function () {
    this.id.setSprite(this.openedImage)
})
Door.member('onClose', function () {
    this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback) {
    Object.call(this, room, name, image)

    // Keypad properties
    this.password = password
    this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function () {
    showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message) {
    Keypad.call(this, room, name, image, password, function () {
        printMessage(message)
        door.unlock()
    })
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image) {
    Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function () {
    this.id.pick()
})
// Item.member('isHanded', function () {
//     return Game.handItem() == this.id
// })






// 방 구성
Minigame = new Room('Minigame', '밤하늘.png')
Livingroom = new Room('Livingroom', '거실.png')
bedroom = new Room('bedroom', 'bedroomwall.png')  
kid_room = new Room('kid_room', 'baby_background.jpg')
parent_room = new Room('parent_room', '거실.png')
outside = new Room('outside', '밤하늘.png')
choiceroom = new Room('choiceroom', 'bedroomwalladd.png')
choiceroom1=new Room('choiceroom1','bedroomwall.png')
choiceroom2=new Room('choiceroom2','bedroomwall.png')
startroom = new Room('startroom', 'startpage.png')
SantaRoom = new Room('SantaRoom', 'brick.jpg')
SantaRoom2 = new Room('SantaRoom2', 'brick.jpg')
DeskView = new Room('DeskView', 'desk_background.png')
BearEnding = new Room('BearEnding', 'bearending.png')



/*  startroom */
playSound('start.wav')

startroom.door1 = new Door(startroom, 'door1', 'startbutton.png', 'startbutton.png', SantaRoom)
startroom.door1.resize(130)
startroom.door1.locate(640, 590)


startroom.door1.onClick = function(){
	Game.move(this.connectedTo)
}




//SantaRoom
SantaRoom.next =new Object(SantaRoom, 'next', 'next.png') //책장
SantaRoom.next.resize(90)
SantaRoom.next.locate(1250, 340)
SantaRoom.next.lock()
SantaRoom.next.onClick = function() { 
	if(SantaRoom.next.isClosed()){
		Game.move(SantaRoom2)
	} else if (SantaRoom.next.isLocked()){
		printMessage("아직 만들어야 할 선물이 남아있다.")
	} 
}

SantaRoom.bookshelf =new Object(SantaRoom, 'bookshelf', 'bookshelf_SantaRoom.png') //책장
SantaRoom.bookshelf.resize(260)
SantaRoom.bookshelf.locate(1100, 270)

SantaRoom.window =new Object(SantaRoom, 'window', 'window_SantaRoom.png') //창문
SantaRoom.window.resize(280)
SantaRoom.window.locate(750, 140)
SantaRoom.window.onClick = function(){
	printMessage("화이트 크리스마스!")
}



SantaRoom.post =new Object(SantaRoom, 'post', 'post1.png') //편지
SantaRoom.post.resize(60)
SantaRoom.post.locate(480, 620)
SantaRoom.post.hide()
SantaRoom.post.onClick = function(){
	SantaRoom.post.pick()
	printMessage("편지를 열어보자")
	SantaRoom.desk.unlock()
}

SantaRoom.post2 =new Object(SantaRoom, 'post2', 'letter_SantaRoom.png')
SantaRoom.post2.hide()
SantaRoom.post3 =new Object(SantaRoom, 'post3', 'letter2_SantaRoom.png')
SantaRoom.post3.hide()

var box = 0
SantaRoom.postbox =new Object(SantaRoom, 'postbox', 'postbox_SantaRoom.png') //우편함
SantaRoom.postbox.resize(80)
SantaRoom.postbox.locate(520, 120)
SantaRoom.postbox.onClick = function(){
	if (box == 0){
		printMessage("앗, 뭔가가 떨어졌다.")
		SantaRoom.post.show()
		box++
	}
	else {
		printMessage("방금이 마지막 편지였던 것 같다.")
	}
}


SantaRoom.desk = new Object(SantaRoom, 'desk', 'desk_SantaRoom.png') //책상
SantaRoom.desk.resize(450)
SantaRoom.desk.locate(260, 300)
SantaRoom.desk.lock()
SantaRoom.desk.onClick = function(){
	if (this.id.isLocked()){
		printMessage("뭘 만들지 아직 모르는걸")
	}
	else{	
		Game.move(DeskView)
		printMessage("레시피가 필요해")
	}
}

SantaRoom.armchair =new Object(SantaRoom, 'armchair', 'armchair.png')
SantaRoom.armchair.resize(350)
SantaRoom.armchair.locate(260, 520)
SantaRoom.armchair.onClick = function(){
		printMessage("쉬고 싶지만 시간이 없다. 얼른 선물을 만들자")
}

SantaRoom.santahat =new Object(SantaRoom, 'santahat', 'santahat2.png')
SantaRoom.santahat.resize(130)
SantaRoom.santahat.locate(360, 380)

SantaRoom.santabag =new Object(SantaRoom, 'santabag', 'santabag_SantaRoom.png') //산타가방
SantaRoom.santabag.resize(260)
SantaRoom.santabag.locate(690, 320)
SantaRoom.santabag.onClick = function(){
		printMessage("올해도 바쁘겠다. 부지런히 일하자.")
}



SantaRoom.coin =new Object(SantaRoom, 'coin', 'coin.png')//동전
SantaRoom.coin.resize(30)
SantaRoom.coin.locate(690, 630)
SantaRoom.coin.hide()
SantaRoom.coin.onClick = function(){
	SantaRoom.coin.pick()
}

var luck = 0
SantaRoom.rug =new Object(SantaRoom, 'rug', 'rug_SantaRoom.png') //카펫
SantaRoom.rug.resize(520)
SantaRoom.rug.locate(690, 530)
SantaRoom.rug.onClick = function(){
	if (luck == 0){
		printMessage("행운의 100원!")
		SantaRoom.coin.show()
		luck++
	}
	else {
		printMessage("더 이상 아무 것도 없다.")
	}
}

SantaRoom.present1 =new Object(SantaRoom, 'present1', 'present1_SantaRoom.png') //선물1
SantaRoom.present1.resize(250)
SantaRoom.present1.locate(550, 460)
SantaRoom.present1.onClick = function(){
		printMessage("올해도 바쁘겠다. 부지런히 일하자.")
}


SantaRoom.present2 =new Object(SantaRoom, 'present2', 'present2_SantaRoom.png') //선물2
SantaRoom.present2.resize(240)
SantaRoom.present2.locate(820, 460)
SantaRoom.present2.onClick = function(){
		printMessage("올해도 바쁘겠다. 부지런히 일하자.")
}

SantaRoom.book1 =new Object(SantaRoom, 'book1', 'book1_SantaRoom.png') //책1
SantaRoom.book1.resize(70)
SantaRoom.book1.locate(1010, 580)
SantaRoom.book1.onClick = function(){
		showImageViewer("bookimage.jpg")
}


SantaRoom.book2 =new Object(SantaRoom, 'book2', 'book2_SantaRoom.png') //책2
SantaRoom.book2.resize(150)
SantaRoom.book2.locate(1160, 540)

SantaRoom.teddybear =new Object(SantaRoom, 'teddybear', 'teddybear_SantaRoom.png')
SantaRoom.teddybear.resize(100)
SantaRoom.teddybear.locate(260, 180)
SantaRoom.teddybear.hide()


//DeskView
DeskView.sewing =new Object(DeskView, 'sewing', 'sewing.png')
DeskView.sewing.resize(450)
DeskView.sewing.locate(1000, 150)
DeskView.sewing.onClick = function(){
		printMessage("드르르르륵")
}

DeskView.return =new Object(DeskView, 'return', 'return.png')
DeskView.return.resize(130)
DeskView.return.locate(640, 650)
DeskView.return.onClick = function(){
		Game.move(SantaRoom)
}

DeskView.pincushion =new Object(DeskView, 'pincushion', 'pincushion.png') //바늘꽂이
DeskView.pincushion.resize(100)
DeskView.pincushion.locate(400, 150)

DeskView.glue =new Object(DeskView, 'glue', 'glue.png')//풀
DeskView.glue.resize(60)
DeskView.glue.locate(540, 130)
DeskView.glue.onClick = function(){
	Game.move(BearEnding)
	game.setTimer(4, 1, '초')
	printMessage("인형은 풀로 붙여 만드는 게 아니야!")
	game.setGameoverMessage("매뉴얼을 잘 따르셨어야죠.")
}

//SantaRoom2
SantaRoom2.prev =new Object(SantaRoom2, 'prev', 'prev.png') //왼쪽 화살표
SantaRoom2.prev.resize(90)
SantaRoom2.prev.locate(30, 340)
SantaRoom2.prev.onClick = function() { 
	Game.move(SantaRoom)
}

SantaRoom2.rug2 =new Object(SantaRoom2, 'rug2', 'rug-2.png') //카펫
SantaRoom2.rug2.resize(500)
SantaRoom2.rug2.locate(640, 520)

SantaRoom2.door1 =new Object(SantaRoom2, 'door1', 'close door-right.png') //문
SantaRoom2.door1.resize(200)
SantaRoom2.door1.locate(640, 220)
SantaRoom2.door1.lock()
SantaRoom2.door1.onClick = function() {	
	if (SantaRoom2.door1.isLocked() && SantaRoom.teddybear.isHanded()){
        this.id.unlock()
        printMessage("선물이 준비되었다! 출발하자")
        SantaRoom2.door1.setSprite("open door-right.png")
    }
	else if (this.id.isClosed()){
		Game.move(Minigame)
        printMessage("빠르게 화살표를 눌러 시내로 이동하자")
    }
    else {
        printMessage("선물을 모두 만들어야 한다.")
    }
}

SantaRoom2.cabinet =new Object(SantaRoom2, 'cabinet', 'cabinet.png')
SantaRoom2.cabinet.resize(300)
SantaRoom2.cabinet.locate(980, 220)
SantaRoom2.cabinet.onClick = function() {

    printMessage("신발을 신었다. 진짜 준비 완료!")
  
}


//곰 엔딩
BearEnding.badbear2 = new Object(BearEnding, 'badbear2', 'badbear2.png')
BearEnding.badbear2.resize(540)
BearEnding.badbear2.locate(860, 320)


BearEnding.crysanta =new Object(BearEnding, 'crysanta', 'cryingsanta.png')
BearEnding.crysanta.resize(300)
BearEnding.crysanta.locate(350, 350)


DeskView.scissors =new Object(DeskView, 'scissors', 'scissors.png') // 가위
DeskView.scissors.resize(80)
DeskView.scissors.locate(450, 300)

DeskView.needle =new Object(DeskView, 'needle', 'needle.png')
DeskView.needle.resize(100)
DeskView.needle.locate(660, 160)

//곰인형
DeskView.bearhead =new Object(DeskView, 'bearhead', 'bearhead.png')
DeskView.bearhead.resize(170)
DeskView.bearhead.locate(640, 320)
DeskView.bearhead.onClick = function(){
	DeskView.bearhead.pick()
}


DeskView.bearleg =new Object(DeskView, 'bearleg', 'bearleg.png')
DeskView.bearleg.resize(170)
DeskView.bearleg.locate(240, 220)
DeskView.bearleg.onClick = function(){
	DeskView.bearleg.pick()
	SantaRoom.next.unlock()
}

DeskView.bearstomach =new Object(DeskView, 'bearstomach', 'bearstomach.png')
DeskView.bearstomach.resize(170)
DeskView.bearstomach.locate(1080, 380)
DeskView.bearstomach.onClick = function(){
	DeskView.bearstomach.pick()
}

DeskView.beararm =new Object(DeskView, 'beararm', 'beararm.png')
DeskView.beararm.resize(170)
DeskView.beararm.locate(140, 350)
DeskView.beararm.onClick = function(){
	DeskView.beararm.pick()
}

//장식들
DeskView.ribbon1 =new Object(DeskView, 'ribbon1', 'ribbon1.png')
DeskView.ribbon1.resize(100)
DeskView.ribbon1.locate(800, 380)

DeskView.ribbon2 =new Object(DeskView, 'ribbon2', 'ribbon2.png')
DeskView.ribbon2.resize(30)
DeskView.ribbon2.locate(340, 400)

DeskView.ribbon4 =new Object(DeskView, 'ribbon4', 'ribbon4.png')
DeskView.ribbon4.resize(150)
DeskView.ribbon4.locate(640, 460)

//곰인형 조합
DeskView.noleg =new Object(DeskView, 'noleg', 'noleg.png')
DeskView.noleg.hide()
DeskView.nohead =new Object(DeskView, 'nohead', 'nohead.png')
DeskView.nohead.hide()

Game.combination(DeskView.beararm, DeskView.bearstomach, DeskView.noleg)
Game.combination(DeskView.noleg, DeskView.bearleg, DeskView.nohead)
Game.combination(DeskView.nohead, DeskView.bearhead, SantaRoom.teddybear)
Game.combination(SantaRoom.post2, SantaRoom.post3, SantaRoom.post)


/*            Miniagame            */
var santaX = 250
var santaY = 170
var i = 0
var cnt = 0
Minigame.santa = new Object(Minigame, 'santa', '산타썰매.png')
Minigame.santa.resize(300)
Minigame.santa.locate(santaX, 170)

Minigame.button = new Object(Minigame, 'button', '버튼.png')
Minigame.button.resize(150)
Minigame.button.locate(650, 620)
Minigame.button.onClick = function () {
    cnt++
    if (cnt == 1){
    game.setTimer(10, 1, "초")
    game.setGameoverMessage("너무 늦어서 12월 26일이 되어버렸다...")
    }
    else {
        i += 20
        Minigame.santa.locate(santaX + i, santaY)
        if (Minigame.santa.getX() > 1280) {
            Game.move(Town)
            game.hideTimer()
        }
    }
}









/*            Town           */
Town = new Room('Town', '마을.png')
Town.house1 = new Object(Town, 'house1', '집_1.png')
Town.house1.resize(150)
Town.house1.locate(500, 360)
Town.house1.onClick = function () {
    playSound("황당.wav")
    Game.over("빈집털이범으로 오해받았다...\n 그레이스의 집은 어디?")
}

Town.house2 = new Object(Town, 'house2', '집_2.png')
Town.house2.resize(150)
Town.house2.locate(300, 530)
Town.house2.onClick = function () {
    playSound("황당.wav")
    Game.over("여긴 티미의 집이었다...\n 그레이스의 집은 어디?")
}

Town.house4 = new Object(Town, 'house4', '집_4.png')
Town.house4.resize(150)
Town.house4.locate(900, 380)
Town.house4.onClick = function () {
    playSound("아모르파티.wav")
    Game.over("밤샘파티가 벌어지는 집이었다...\n 하마터면 같이 놀 뻔")
}

Town.door1 = new Door(Town, 'door1', '집_3.png', '집_3.png', Livingroom)
Town.door1.resize(150)
Town.door1.locate(700, 520)
Town.door1.onClick = function () {
        Game.move(this.connectedTo)
        printMessage("무사히 그레이스의 집에 도착했다!")
}

Town.hospital = new Object(Town, 'hospital', 'hospital.png')
Town.hospital.resize(150)
Town.hospital.locate(700, 380)

Town.bakery = new Object(Town, 'bakery', 'bakery.png')
Town.bakery.resize(170)
Town.bakery.locate(500, 530)

Town.school = new Object(Town, 'school', 'school.png')
Town.school.resize(160)
Town.school.locate(900, 520)








/*           Livingroom            */
//Livingroom = new Room('Livingroom', '거실.png')
Livingroom.setRoomLight(0.8) // 방 밝기 

Livingroom.door1 = new Door(Livingroom, 'door1', 'close door-left.png', 'open door-left.png', kid_room)
Livingroom.door1.resize(190)
Livingroom.door1.locate(180, 210)

Livingroom.door2 = new Door(Livingroom, 'door2', 'close door-left.png', 'open door-left.png', bedroom)
Livingroom.door2.resize(190)
Livingroom.door2.locate(1100, 210)
/*Livingroom.door2.lock() 나중에 다시 lock걸기!!

Livingroom.door2.onClick = function () { // door를 클릭했을 때
    if (Livingroom.key.isHanded() && this.id.isClosed()) {
        this.id.open() // key를 사용해서 door의 상태를 open으로 바꿈
    }
    else if (this.id.isOpened()) { // door가 opened 상태이면
        game.move(bedroom) // 부모님방으로 이동
    }
    else if (this.id.isLocked()) { // door가 locked 상태이면
        printMessage("잠겨있다") // 메시지 출력
    }
}
*/




/*     벽난로     */
Livingroom.fireplace = new Object(Livingroom, 'fireplace', '벽난로_켜짐.png')
Livingroom.fireplace.resize(270)
Livingroom.fireplace.locate(550, 280)
Livingroom.fireplace.close()
Livingroom.fireplace.onClick = function () {
    if(this.id.isClosed()){
    printMessage("따뜻한 벽난로다. 아직 할일이 끝나지 않아 여기로 나갈 수 없다.")
    }
    if (this.id.isOpened()) {
        Game.end("올해도 메리 크리스마스!")
    }
}



/*      소파      */
Livingroom.sofa = new Object(Livingroom, 'sofa', '소파.png')
Livingroom.sofa.resize(450)
Livingroom.sofa.locate(400, 430)
Livingroom.sofa.onClick = function () {
    printMessage("안락한 느낌의 소파다")
}




/*     트리      */
var tree_grass = true
var tool = 0
Livingroom.tree = new Object(Livingroom, 'tree', '트리.png')
Livingroom.tree.resize(400)
Livingroom.tree.locate(820, 300)
Livingroom.tree.onDrag = function (direction) {
    if (direction == "Right" && tree_grass) {
        printMessage("트리를 뜯었다!")
        Livingroom.grass.show()
    }
}
Livingroom.tree.onClick = function () {
    if (tool == 7) {
        printMessage("뭔가 2%가 부족한 느낌이 든다.")
    }
    else if (tool == 8) {
        printMessage("완벽한 트리다.")
    }
    else {
        printMessage("산타로서 트리를 꾸며야 할 것 같은 사명감이 든다.")
    }

    if (kid_room.star.isHanded()) {
        tool = 8
        Livingroom.star1.show()
        printMessage("트리를 완성했다!")
    }
}


 /*     트리 장식     */
// 드래그 모션 direction - Up, Down, Left, Right
 Livingroom.tool1 = new Object(Livingroom, 'tool1', '장식1.png')
 Livingroom.tool1.resize(100)
Livingroom.tool1.locate(350, 600)
Livingroom.tool1.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool1.locate(820, 320)
        tool++
    }
}

 Livingroom.tool2 = new Object(Livingroom, 'tool2', '장식2.png')
 Livingroom.tool2.resize(100)
Livingroom.tool2.locate(450, 620)
Livingroom.tool2.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool2.locate(720, 400)
        tool++
    }
}

 Livingroom.tool3 = new Object(Livingroom, 'tool3', '장식3.png')
 Livingroom.tool3.resize(100)
Livingroom.tool3.locate(750, 600)
Livingroom.tool3.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool3.locate(885, 260)
        tool++
    }
}

 Livingroom.tool4 = new Object(Livingroom, 'tool4', '장식4.png')
 Livingroom.tool4.resize(100)
Livingroom.tool4.locate(850, 600)
Livingroom.tool4.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool4.locate(820, 195)
        tool++
    }
}

 Livingroom.tool5 = new Object(Livingroom, 'tool5', '장식5.png')
 Livingroom.tool5.resize(70)
Livingroom.tool5.locate(950, 550)
Livingroom.tool5.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool5.locate(840, 420)
        tool++
    }
}

 Livingroom.tool6 = new Object(Livingroom, 'tool6', '장식6.png')
 Livingroom.tool6.resize(100)
Livingroom.tool6.locate(1050, 500)
Livingroom.tool6.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool6.locate(930, 410)
        tool++
    }
}

 Livingroom.tool7 = new Object(Livingroom, 'tool7', '장식7.png')
 Livingroom.tool7.resize(100)
Livingroom.tool7.locate(550, 600)
Livingroom.tool7.onDrag = function (direction) {
    if (direction == "Up") {
        Livingroom.tool7.locate(735, 270)
        tool++
    }
}



/*   열쇠   */
Livingroom.key = new Object(Livingroom, 'key', '열쇠.png')
Livingroom.key.resize(60)
Livingroom.key.locate(825, 600)
Livingroom.key.hide() // 숨김
Livingroom.key.onClick = function () {
    printMessage("열쇠를 얻었다.")
    Livingroom.key.pick()
}




/*    별 장식    */
Livingroom.star1 = new Object(Livingroom, 'star1', '장식8.png')
Livingroom.star1.resize(100)
Livingroom.star1.locate(825, 80)
Livingroom.star1.hide()
Livingroom.star1.onClick = function () {
    Livingroom.key.show()
    printMessage("열쇠가 나타났다.")
}






 /*     풀     */
Livingroom.grass = new Item(Livingroom, 'grass', 'grass.png')
Livingroom.grass.resize(50)
Livingroom.grass.locate(920, 280)
Livingroom.grass.hide()
Livingroom.grass.setDescription("루돌프들이 좋아하는 풀이다.")
Livingroom.grass.onClick = function () {
    printMessage("풀을 얻었다.")
    Livingroom.grass.pick()
}













/*           kid_room           */
kid_room.setRoomLight(0.8)

kid_room.door = new Door(kid_room, 'door', 'close door-left.png', 'open door-left.png', Livingroom)
kid_room.door.resize(190)
kid_room.door.locate(1100, 194)

kid_room.carpet = new Object(kid_room, 'carpet', 'carpet.png')
kid_room.carpet.resize(680)
kid_room.carpet.locate(700, 600)
kid_room.carpet.onClick = function () {
    printMessage("부드러운 카펫이다.")
}

kid_room.window = new Object(kid_room, 'window', 'baby_window.png')
kid_room.window.resize(400)
kid_room.window.locate(500, 140)
kid_room.window.lock()
kid_room.window.onClick = function () {
    if(bedroom.telescope.isHanded()) {
       kid_room.window.unlock()
       printMessage("보인다!")
    }
	
    if(kid_room.window.isLocked()) {
       printMessage("저 멀리 무언가가 있는 것 같은데, 너무 멀어서 보이지 않는다.")
    }
    else{
       printMessage("눈이 오고있다. 빛나는 별 아래 우리집 루돌프들이 보인다!")
       Game.move(outside)
    }
}


kid_room.bed = new Object(kid_room, 'bed', 'bed.png')
kid_room.bed.resize(460)
kid_room.bed.locate(260, 315)
kid_room.bed.onClick = function () {
    if (SantaRoom.teddybear.isHanded()){
        kid_room.teddybear2.show()
        printMessage("포비 옆에 그레이스의 선물을 뒀다.")
        Livingroom.fireplace.open()

    }
    else printMessage("아이가 자고있다.")
}

kid_room.teddybear2 = new Object(kid_room, 'teddybear2', 'teddybear_SantaRoom.png')
kid_room.teddybear2.resize(90)
kid_room.teddybear2.locate(325, 320)
kid_room.teddybear2.hide()

kid_room.bear = new Object(kid_room, 'bear', 'bear.png')
kid_room.bear.resize(100)
kid_room.bear.locate(405, 320)
kid_room.bear.onClick = function () {
    printMessage("리본에 '포비'라고 써있다.")
}

kid_room.bookshelf = new Object(kid_room, 'bookshelf', 'bookshelf.png')
kid_room.bookshelf.resize(170)
kid_room.bookshelf.locate(850, 200)

kid_room.blockA = new Object(kid_room, 'blockA', 'A block.png')
kid_room.blockA.locate(808, 85)
kid_room.blockA.onClick = function () {
    printMessage("비어있는 상자다.")
}

kid_room.blockB = new Keypad(kid_room, 'blockB', 'B block.png', '56744', function () {
    kid_room.blockB.unlock()
    printMessage("자물쇠를 열였다.")
})
kid_room.blockB.locate(850, 85)
kid_room.blockB.lock()
kid_room.blockB.onClick = function () {
    if (kid_room.blockB.isLocked()) {
        printMessage("잠겨있는 상자다. 뭔가 들어있다.")
        showKeypad('telephone', this.password, this.callback)
    }
    else {
        kid_room.blockB.setSprite('opened B block.jpg')
        kid_room.treasureChestKey.show()
        printMessage("열쇠가 들어있다.")
    }

}

kid_room.blockC = new Object(kid_room, 'blockC', 'C block.png')
kid_room.blockC.locate(892, 85)
kid_room.blockC.onClick = function () {
    printMessage("비어있는 상자다.")
}

kid_room.treasureChestKey = new Item(kid_room, 'treasureChestKey', 'Treasure Chest Key.png')
kid_room.treasureChestKey.resize(30)
kid_room.treasureChestKey.locate(851, 93)
kid_room.treasureChestKey.hide()
kid_room.treasureChestKey.onClick = function () {
    printMessage("장난감 열쇠를 얻었다.")
    kid_room.treasureChestKey.pick()
}
kid_room.treasureChestKey.setDescription("장난감 열쇠다.")

kid_room.books1 = new Object(kid_room, 'books1', 'books1.png')
kid_room.books1.resize(50)
kid_room.books1.locate(898, 142)
kid_room.books1.onClick = function () {
    printMessage("[ 그레이스의 일기장 ]")
    showImageViewer("diary.png")
}

kid_room.lotion = new Object(kid_room, 'lotion', 'lotion.png')
kid_room.lotion.locate(820, 209)
kid_room.lotion.onClick = function () {
    printMessage("로션이다.")
}

kid_room.ball = new Object(kid_room, 'ball', 'ball.png')
kid_room.ball.locate(885, 207)
kid_room.ball.onClick = function () {
    printMessage("탱탱볼이다.")
}

var chick = 0
kid_room.chicken = new Object(kid_room, 'chicken', '닭삑삑이.png')
kid_room.chicken.resize(120)
kid_room.chicken.locate(500, 600)
kid_room.chicken.onClick = function () {
    chick++
    playSound("chicken.wav")
    if (chick == 1) {
        printMessage("! 닭삑삑이 인형이다.")
    }
    else if (chick == 2) {
        printMessage("아이가 깰 것 같다..!")
    }
    else {
        playSound("kid-says-wow.wav")
        Game.over("아이가 깨버렸다.\n 나는 산타들의 수치야...")
    }
}

kid_room.table = new Object(kid_room, 'table', 'kid table.png')
kid_room.table.resize(185)
kid_room.table.locate(780, 520)
kid_room.table.onClick = function () {
    printMessage("귀여운 꼬마 책상이다.")
}

kid_room.books = new Object(kid_room, 'books', 'books.png')
kid_room.books.resize(73)
kid_room.books.locate(837, 440)
kid_room.books.onClick = function () {
    printMessage("아이의 학습지다.")
    showImageViewer("worksheet.png")
}

var treasure = 0
kid_room.treasureChest = new Object(kid_room, 'treasureChest', 'Closed Treasure Chest.png')
kid_room.treasureChest.resize(120)
kid_room.treasureChest.locate(580, 330)
kid_room.treasureChest.lock()
kid_room.treasureChest.onClick = function () {
    if (!treasure) {
        if (kid_room.treasureChest.isLocked()) {
            printMessage("[ 그레이스의 보물상자 ]\n 잠겨있다.")
        }
        if (kid_room.treasureChestKey.isHanded()) {
            playSound("locking-keyed-padlock.wav")
            printMessage("보물상자가 열렸다! 뭔가 들어있다.")
            kid_room.treasureChest.setSprite('Opened Treasure Chest.png')
            kid_room.treasureChest.unlock()
            treasure = 1
            kid_room.cutted_star.show()
        }
    }
    else {
        printMessage("[ 그레이스의 보물상자 ]")
    }
}

kid_room.star = new Object(kid_room, 'star', '장식8.png')
kid_room.star.hide()
kid_room.star.setDescription("트리 장식이다.")

kid_room.cutted_star = new Object(kid_room, 'cutted_star', 'cutted star.png')
kid_room.cutted_star.resize(50)
kid_room.cutted_star.locate(580, 310)
kid_room.cutted_star.hide()
kid_room.cutted_star.onClick = function () {
    printMessage("별을 얻었다.")
    kid_room.cutted_star.hide()
    kid_room.star.pick()
}








/*          outside          */
outside.arrow = new Object(outside, 'arrow', 'down_arrow.png')
outside.arrow.resize(100)
outside.arrow.locate(640, 650)
outside.arrow.onClick = function () {
    Game.move(kid_room)
}

// 작은 루돌프
var clear = 0
outside.rudolph1 = new Object(outside, 'rudolph1', '루돌프_썰매.png')
outside.rudolph1.resize(80)
outside.rudolph1.locate(900, 120)

// 큰 루돌프
outside.rudolph2 = new Object(outside, 'rudolph2', '루돌프_썰매.png')
outside.rudolph2.resize(600)
outside.rudolph2.locate(640, 400)
outside.rudolph2.hide()

outside.rudolph1.onClick = function () {
    printMessage("오라고 하니까 고개를 흔든다. 무임승차는 안 된다는 건가...")
    if (Livingroom.grass.isHanded()) {
        printMessage("풀을 보여줬더니 루돌프들이 왔다!")
        outside.rudolph1.hide()
        outside.rudolph2.show()
    }
}

outside.rudolph2.onClick = function () {
    Game.end("Mission Clear!!")
}





/*        bedroom         */
//부모님방 bedroom
bedroom.door1 = new Door(bedroom, 'door1', 'doorlock.png', 'dooropen.png', Livingroom)
bedroom.door1.resize(230)
bedroom.door1.locate(1040, 218)

bedroom.window = new Object(bedroom, 'window', 'snowwindow.png')
bedroom.window.resize(450)
bedroom.window.locate(640, 210)
bedroom.window.onClick = function () {
	printMessage("밖에는 눈이 펑펑 오고있다.")
}

bedroom.carpet = new Object(bedroom, 'carpet', '카펫1.png')
bedroom.carpet.resize(700)
bedroom.carpet.locate(640, 550)
bedroom.carpet.onClick = function () {
    printMessage("카펫 밑에는 아무것도 없다.")
}

bedroom.bed=new Door (bedroom,'bed','bed_bedroom.png','bed_bedroom.png',choiceroom)
bedroom.bed.resize(450)
bedroom.bed.locate(640, 380)


bedroom.shelf=new Object(bedroom,'shelf','shelf.png')
bedroom.shelf.resize(250)
bedroom.shelf.locate(240,280)
bedroom.shelf.onClick=function(){
    printMessage("딱히 재미있어 보이는 책이 없다.")
}

bedroom.candycane = new Object(bedroom, 'candycane', 'candycane.png')
bedroom.candycane.resize(120)
bedroom.candycane.locate(100, 315)
bedroom.candycane.onClick = function () {
    printMessage("무시무시한 지팡이 사탕이다. 무기로 딱이군.")
    bedroom.candycane.pick()
}

bedroom.clock=new Object(bedroom,'clock','clock_bedroom.png')
bedroom.clock.resize(130)
bedroom.clock.locate(235,105)
bedroom.clock.onClick=function(){
	printMessage("서두르자!!")
}

bedroom.telescope=new Item(bedroom,'telescope','telescope.png')
bedroom.telescope.resize(200)
bedroom.telescope.locate(700,500)
bedroom.telescope.hide()
bedroom.telescope.setDescription(" 망원경이다.")

bedroom.hat = new Item(bedroom, 'hat', 'santahat.png')
bedroom.hat.resize(60)
bedroom.hat.locate(215,250)
bedroom.hat.onClick = function () {
    printMessage("아니 이건 내 모자인데...? 작년에 두고갔나...? 일단 챙겨보자.")
    bedroom.hat.pick()
}


var telescope=0
bedroom.snowman=new Object(bedroom,'snowman','snowman.png')
bedroom.snowman.resize(200)
bedroom.snowman.locate(700,500)

bedroom.snowman.onClick=function(){
	if(!telescope){
        printMessage("아이가 만든 눈사람인가? 안에 뭐가 들어있는것 같다.")
        }
    if(bedroom.hat.isHanded()){
        printMessage("눈사람이 너무 따뜻해져서 녹았다!")
        bedroom.snowman.hide()
        bedroom.telescope.show()
        telescope=1
        }
    else{
        printMessage("왜 눈사람이 녹지 않았지?")
    }
}




//선택지 방 choiceroom (bedroom과 연결됨)
choiceroom.text=new Object(choiceroom,'text','text.png')
choiceroom.text.resize(600)
choiceroom.text.locate(640,150)

choiceroom.choice1 = new Object(choiceroom, 'choice1', 'choice1.png')
choiceroom.choice1.resize(500)
choiceroom.choice1.locate(640,300)
choiceroom.choice1.onClick = function() {
	Game.move(choiceroom1)
	game.setTimer(5, 1, "초")
	playSound('scream.wav')
}

choiceroom.choice2 = new Object(choiceroom, 'choice2', 'choice2.png')
choiceroom.choice2.resize(500)
choiceroom.choice2.locate(640,400)
choiceroom.choice2.onClick = function() {
	Game.move(choiceroom2)
	game.setTimer(5, 1, "초")
	playSound('police.wav')
}

choiceroom.choice3 = new Object(choiceroom, 'choice3', 'choice3.png')
choiceroom.choice3.resize(500)
choiceroom.choice3.locate(640,500)
choiceroom.choice3.onClick = function() {
	Game.move(bedroom)
	printMessage('사탕으로 부모님을 기절시키는데 성공했다!')
}


//선택지방1
choiceroom1.santa=new Object(choiceroom1,'santa','cryingsanta.png')
choiceroom1.santa.resize(400)
choiceroom1.santa.locate(640,450)

choiceroom1.text1=new Object(choiceroom1,'text1','choiceroom1.png')
choiceroom1.text1.resize(500)
choiceroom1.text1.locate(640,200)

//선택지방2
choiceroom2.police=new Object(choiceroom2,'police','policecar.png')
choiceroom2.police.resize(600)
choiceroom2.police.locate(640,450)

choiceroom2.text2=new Object(choiceroom2,'text2','choiceroom2.png')
choiceroom2.text2.resize(500)
choiceroom2.text2.locate(640,200)

//선택지방3






// 게임 시작
Game.start(startroom, "게임을 시작하려면 Start 버튼을 누르세요.")
