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
Item.member('isHanded', function () {
    return Game.handItem() == this.id
})







Minigame = new Room('Minigame', '밤하늘.png')
Town = new Room('Town', '마을.png')
Livingroom = new Room('Livingroom', '거실.png')
kid_room = new Room('kid_room', 'baby_background.jpg') // 아이방
parent_room = new Room('parent_room', 'baby_background.jpg')  // 부모님방 - 배경파일 수정할 것



/*      썰매타고 밤 하늘 이동하기      */
Minigame.santa = new Object(Minigame, 'santa', '산타썰매.png')
Minigame.santa.resize(300)  
Minigame.santa.locate(250, 150) 

Minigame.door1 = new Door(Minigame, 'door1', '버튼.png', '버튼.png', Town)
Minigame.door1.resize(150)
Minigame.door1.locate(650, 620)
Minigame.door1.close()
Minigame.door1.onClick = function() {
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

}

// 제한 시간 내에 화살표 버튼을 연속으로 눌러서 썰매를 오른쪽 끝까지 움직이면 마을로 이동하는 기능 필요
// 현재는 화살표 누르면 바로 이동


/*     마을에서 집 고르기     */
Town.house1 = new Object(Town, 'house1', '집_1.png')
Town.house1.resize(150)
Town.house1.locate(500, 400)
Town.house1.onClick = function() {
	 playSound("황당.wav")
	 Game.over("빈집털이범으로 오해받았다...\n 그레이스의 집은 어디?")
}

Town.house2 = new Object(Town, 'house2', '집_2.png')
Town.house2.resize(150)
Town.house2.locate(500, 570)
Town.house2.onClick = function() {
	playSound("황당.wav")
	Game.over("여긴 티미의 집이었다...\n 그레이스의 집은 어디?")
}

Town.house4 = new Object(Town, 'house4', '집_4.png')
Town.house4.resize(150)
Town.house4.locate(700, 420)
Town.house4.onClick = function() {
	playSound("아모르파티.wav")
	Game.over("밤샘파티가 벌어지는 집이었다...\n 하마터면 같이 놀 뻔")
}

Town.door1 = new Door(Town, 'door1', '집_3.png', '집_3.png', Livingroom)
Town.door1.resize(150)
Town.door1.locate(700, 560)   
Town.door1.onClick = function() {
	if (!this.id.isLocked() && this.id.isClosed()) {
		this.id.open()
	} 
	else if (this.id.isOpened()) {
		if (this.connectedTo !== undefined) {
			Game.move(this.connectedTo)
			printMessage("무사히 그레이스의 집에 도착했다!") 
		} 
		else {
			Game.end()
		} 
	}
}



/*     그레이스의 집      */
Livingroom.setRoomLight(0.8) // 방 밝기 

Livingroom.door1 = new Door(Livingroom, 'door1', '닫힌문.png', '열린문.png', kid_room)
Livingroom.door1.resize(250)
Livingroom.door1.locate(180, 160)

Livingroom.door2 = new Door(Livingroom, 'door2', '닫힌문.png', '열린문.png', parent_room)
Livingroom.door2.resize(250)
Livingroom.door2.locate(1100, 160)
Livingroom.door2.lock()

Livingroom.door2.onClick = function() { // door를 클릭했을 때
	if (Livingroom.key.isHanded() && this.id.isClosed()) { 
		this.id.open() // key를 사용해서 door의 상태를 open으로 바꿈
	} 
	else if (this.id.isOpened()) { // door가 opened 상태이면
        		game.move(parent_room) // 부모님방으로 이동
	}
	else if (this.id.isLocked()) { // door가 locked 상태이면
        		printMessage("잠겨있다") // 메시지 출력
	}
}



/*   열쇠   */
Livingroom.key = new Object(Livingroom, 'key', '열쇠.png')
Livingroom.key.resize(100)
Livingroom.key.locate(500, 350)
Livingroom.key.hide() // 숨김



/*     벽난로     */
Livingroom.fireplace = new Object(Livingroom, 'fireplace', '벽난로_켜짐.png')
Livingroom.fireplace.resize(270)
Livingroom.fireplace.locate(550, 280)



/*      소파      */
Livingroom.sofa = new Object(Livingroom, 'sofa', '소파.png')
Livingroom.sofa.resize(500)

Livingroom.sofa.locate(400, 430)
Livingroom.sofa.onClick = function () {
    printMessage("안락한 느낌의 소파다")
}

// 드래그 모션 direction - Up, Down, Left, Right

//Livingroom.sofa.onDrag = function (direction) {
//    if (direction == "Right" && Livingroom.sofa.move) {
//	printMessage("소파에 뭔가 있다")
//	Livingroom.sofa.moveX(100)
//	Livingroom.sofa.moveY(-40)
//	Livingroom.sofa.move = false // 이후에는 더 이상 움직이지 않도록 함
//	Livingroom.key.show()  // 열쇠 발견
//    }
//}

//Livingroom.key.onClick = function () {
//    printMessage("열쇠를 얻었다")
//    Livingroom.key.pick()
//}

// 소파를 오른쪽으로 밀어서 바닥에 있는 열쇠를 발견하고, 그걸로 부모님 방을 여는 설정을 넣고 싶었는데
// 동작이 안 되네요.....


/*     트리 장식     */
Livingroom.tool1 = new Object(Livingroom, 'tool1', '장식1.png')
Livingroom.tool1.resize(100)
Livingroom.tool1.locate(350, 600)

Livingroom.tool2 = new Object(Livingroom, 'tool2', '장식2.png')
Livingroom.tool2.resize(100)
Livingroom.tool2.locate(450, 620)

Livingroom.tool3 = new Object(Livingroom, 'tool3', '장식3.png')
Livingroom.tool3.resize(100)
Livingroom.tool3.locate(750, 600)

Livingroom.tool4 = new Object(Livingroom, 'tool4', '장식4.png')
Livingroom.tool4.resize(100)
Livingroom.tool4.locate(850, 600)

Livingroom.tool5 = new Object(Livingroom, 'tool5', '장식5.png')
Livingroom.tool5.resize(70)
Livingroom.tool5.locate(950, 550)

Livingroom.tool6 = new Object(Livingroom, 'tool6', '장식6.png')
Livingroom.tool6.resize(100)
Livingroom.tool6.locate(1050, 500)

Livingroom.tool7 = new Object(Livingroom, 'tool7', '장식7.png')
Livingroom.tool7.resize(100)
Livingroom.tool7.locate(550, 600)

Livingroom.tool8 = new Object(Livingroom, 'tool8', '장식8.png')
Livingroom.tool8.resize(100)
Livingroom.tool8.locate(1050, 600)


/*     트리      */
Livingroom.tree = new Object(Livingroom, 'tree', '트리.png')
Livingroom.tree.resize(350)
Livingroom.tree.locate(800, 300)


/*     풀     */
Livingroom.grass = new Item(Livingroom, 'grass', 'grass.png')
Livingroom.grass.resize(50)
Livingroom.grass.locate(800, 280)
Livingroom.grass.setDescription("루돌프들이 좋아하는 풀이다.")
Livingroom.grass.onClick = function () {
    printMessage("이 풀은 뭐지?")
    Livingroom.grass.pick()
}

// 트리 장식들을 트리로 드래그해서 꾸밀 수 있는 기능 필요


/*    트리 그림    */
kid_room.treepicture = new Item(kid_room, 'treepicture', '트리그림.png')
kid_room.treepicture.resize(50)
kid_room.treepicture.locate(800, 280)
kid_room.treepicture.setDescription("예쁜 트리가 그려져 있는 그림. 물감이 쏟아졌던 흔적이 있다.")

kid_room.treepicture.onClick = function () {
    printMessage("그림을 발견했다!")
    kid_room.treepicture.pick()
}
// 아이 방의 특정 공간에 숨겨져 있으면 좋겠음....





/*      아이방      */
kid_room = new Room('kid_room', 'baby_background.jpg')
kid_room.setRoomLight(0.8)

kid_room.door = new Door(kid_room, 'door', 'close door-left.png', 'open door-left.png',null)
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
kid_room.window.onClick = function () {
    printMessage("눈이 오고있다. 빛나는 별 아래 우리집 루돌프들이 보인다!")
    Game.move(outside)
}

kid_room.bed = new Object(kid_room, 'bed', 'bed.png')
kid_room.bed.resize(460)
kid_room.bed.locate(260, 315)
kid_room.bed.onClick = function () {
    printMessage("아이가 자고있다.")
}

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
            printMessage("보물상자다. 잠겨있다.")
        }
        if (kid_room.treasureChestKey.isHanded()) {
            playSound("locking-keyed-padlock.wav")
            printMessage("보물상자가 열렸다.")
            kid_room.treasureChest.setSprite('Opened Treasure Chest.png')
            kid_room.treasureChest.unlock()
            treasure = 1
        }
    }
    else {
        printMessage("뭔가 들어있다.")
    }
}








/*      창 밖        */
outside = new Room('outside', '밤하늘.png')

outside.arrow = new Object(outside, 'arrow', 'down_arrow.png')
outside.arrow.resize(100)
outside.arrow.locate(640, 650)
outside.arrow.onClick = function () {
    Game.move(kid_room)
}

// 거실 트리 뜯으면 얻을 수 있게끔
outside.grass = new Item(outside, 'grass', 'grass.png')
outside.grass.locate(500,500)
outside.grass.setDescription("루돌프들이 좋아하는 풀이다.")
//

// 작은 루돌프
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
    if (outside.grass.isHanded()) {
        printMessage("풀을 보여줬더니 루돌프들이 왔다!")
        outside.rudolph1.hide()
        outside.rudolph2.show()
    }
}

outside.rudolph2.onClick = function () {
    Game.end("Mission Clear!!")
}












Game.start(kid_room, '방탈출에 오신 것을 환영합니다!')
