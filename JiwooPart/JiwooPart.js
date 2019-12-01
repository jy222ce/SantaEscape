Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game() { }
Game.start = function (room, welcome) {
    game.start(room.id)
    printMessage(welcome)
}
Game.end = function (msg) {
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

//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})



//방 정의
startroom = new Room('startroom', 'startpage.png')
bedroom = new Room('bedroom', 'bedroomwall.png')
choiceroom = new Room('choiceroom', 'bedroomwall.png')

//시작 페이지에서만 노래가 나오게 하고 싶은데 멈추는 방법을 모르겠음...
playSound('start.wav')

//startpage
startroom.door1 = new Door(startroom, 'door1', 'startbutton.png', 'startbutton.png', bedroom)
startroom.door1.resize(130)
startroom.door1.locate(640, 590)


startroom.door1.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if(this.id.isLocked()){
		printMessage("문이 잠겨있다.")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}

//부모님방 bedroom
bedroom.door1 = new Door(bedroom, 'door1', 'doorlock.png', 'dooropen.png', startroom)
bedroom.door1.resize(230)
bedroom.door1.locate(1040, 218)


bedroom.window = new Object(bedroom, 'window', 'snowwindow.png')
bedroom.window.resize(450)
bedroom.window.locate(640, 210)
bedroom.window.onClick = function () {
    printMessage("밖에는 눈이 펑펑 오고 있다.")
}

bedroom.carpet = new Object(bedroom, 'carpet', '카펫1.png')
bedroom.carpet.resize(700)
bedroom.carpet.locate(640, 550)
bedroom.carpet.onClick = function () {
    printMessage("카펫 밑에는 아무것도 없다.")
}

//문에 onClick 먹지 않는거 해결..?
bedroom.bed=new Door (bedroom,'bed','bed.png','bed.png',choiceroom)
bedroom.bed.resize(450)
bedroom.bed.locate(640, 380)


bedroom.shelf=new Object(bedroom,'shelf','shelf.png')
bedroom.shelf.resize(250)
bedroom.shelf.locate(240,280)
bedroom.shelf.onClick=function(){
    printMessage("선반에는 책밖에 없다.")
}

bedroom.candycane = new Object(bedroom, 'candycane', 'candycane.png')
bedroom.candycane.resize(120)
bedroom.candycane.locate(100, 315)
bedroom.candycane.onClick = function () {
    printMessage("무시무시한 지팡이 사탕이다. 무기로 딱이군.")
    bedroom.candycane.pick()
}

bedroom.clock=new Object(bedroom,'clock','clock.png')
bedroom.clock.resize(130)
bedroom.clock.locate(235,105)
bedroom.clock.onClick=function(){
	printMessage("서두르자!!")
}

bedroom.hat = new Object(bedroom, 'hat', 'santahat.png')
bedroom.hat.resize(100)
bedroom.hat.locate(215,250)
bedroom.hat.onClick = function () {
    printMessage("아니 이건 내 모자인데...? 누가 나를 따라하나...? 일단 챙겨보자.")
    bedroom.hat.pick()
}

//선택지 방 choiceroom (bedroom과 연결됨)
choiceroom.choice1 = new Object(choiceroom, 'choice1', 'choice1.png')
choiceroom.choice1.resize(500)
choiceroom.choice1.onClick = function () {
    printMessage("1번을 선택했다.")
    playSound('scream.wav')
    //타이머 설정해서 이미지 보여준 후 게임 엔딩
}






Game.start(startroom, '방탈출에 오신 것을 환영합니다!')