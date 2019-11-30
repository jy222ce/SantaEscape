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





/*      ���̹�      */
kid_room = new Room('kid_room', 'baby_background.jpg')
kid_room.setRoomLight(0.8)

kid_room.door = new Door(kid_room, 'door', 'close door-left.png', 'open door-left.png',null)
kid_room.door.resize(190)
kid_room.door.locate(1100, 194)

kid_room.carpet = new Object(kid_room, 'carpet', 'carpet.png')
kid_room.carpet.resize(680)
kid_room.carpet.locate(700, 600)
kid_room.carpet.onClick = function () {
    printMessage("�ε巯�� ī���̴�.")
}

kid_room.window = new Object(kid_room, 'window', 'baby_window.png')
kid_room.window.resize(400)
kid_room.window.locate(500, 140)
kid_room.window.onClick = function () {
    printMessage("���� �����ִ�. ������ �� �Ʒ� �츮�� �絹������ ���δ�!")
    Game.move(outside)
}

kid_room.bed = new Object(kid_room, 'bed', 'bed.png')
kid_room.bed.resize(460)
kid_room.bed.locate(260, 315)
kid_room.bed.onClick = function () {
    printMessage("���̰� �ڰ��ִ�.")
}

kid_room.bear = new Object(kid_room, 'bear', 'bear.png')
kid_room.bear.resize(100)
kid_room.bear.locate(405, 320)
kid_room.bear.onClick = function () {
    printMessage("������ '����'��� ���ִ�.")
}

kid_room.bookshelf = new Object(kid_room, 'bookshelf', 'bookshelf.png')
kid_room.bookshelf.resize(170)
kid_room.bookshelf.locate(850, 200)

kid_room.blockA = new Object(kid_room, 'blockA', 'A block.png')
kid_room.blockA.locate(808, 85)
kid_room.blockA.onClick = function () {
    printMessage("����ִ� ���ڴ�.")
}

kid_room.blockB = new Keypad(kid_room, 'blockB', 'B block.png', '56744', function () {
    kid_room.blockB.unlock()
    printMessage("�ڹ��踦 ������.")
})
kid_room.blockB.locate(850, 85)
kid_room.blockB.lock()
kid_room.blockB.onClick = function () {
    if (kid_room.blockB.isLocked()) {
        printMessage("����ִ� ���ڴ�. ���� ����ִ�.")
        showKeypad('telephone', this.password, this.callback)
    }
    else {
        kid_room.blockB.setSprite('opened B block.jpg')
        kid_room.treasureChestKey.show()
        printMessage("���谡 ����ִ�.")
    }

}

kid_room.blockC = new Object(kid_room, 'blockC', 'C block.png')
kid_room.blockC.locate(892, 85)
kid_room.blockC.onClick = function () {
    printMessage("����ִ� ���ڴ�.")
}

kid_room.treasureChestKey = new Item(kid_room, 'treasureChestKey', 'Treasure Chest Key.png')
kid_room.treasureChestKey.resize(30)
kid_room.treasureChestKey.locate(851, 93)
kid_room.treasureChestKey.hide()
kid_room.treasureChestKey.setDescription("�峭�� �����.")

kid_room.books1 = new Object(kid_room, 'books1', 'books1.png')
kid_room.books1.resize(50)
kid_room.books1.locate(898, 142)
kid_room.books1.onClick = function () {
    printMessage("[ �׷��̽��� �ϱ��� ]")
    showImageViewer("diary.png")
}

kid_room.lotion = new Object(kid_room, 'lotion', 'lotion.png')
kid_room.lotion.locate(820, 209)
kid_room.lotion.onClick = function () {
    printMessage("�μ��̴�.")
}

kid_room.ball = new Object(kid_room, 'ball', 'ball.png')
kid_room.ball.locate(885, 207)
kid_room.ball.onClick = function () {
    printMessage("���ʺ��̴�.")
}

var chick = 0
kid_room.chicken = new Object(kid_room, 'chicken', '�߻����.png')
kid_room.chicken.resize(120)
kid_room.chicken.locate(500, 600)
kid_room.chicken.onClick = function () {
    chick++
    playSound("chicken.wav")
    if (chick == 1) {
        printMessage("! �߻���� �����̴�.")
    }
    else if (chick == 2) {
        printMessage("���̰� �� �� ����..!")
    }
    else {
        playSound("kid-says-wow.wav")
        Game.over("���̰� �����ȴ�.\n ���� ��Ÿ���� ��ġ��...")
    }
}

kid_room.table = new Object(kid_room, 'table', 'kid table.png')
kid_room.table.resize(185)
kid_room.table.locate(780, 520)
kid_room.table.onClick = function () {
    printMessage("�Ϳ��� ���� å���̴�.")
}

kid_room.books = new Object(kid_room, 'books', 'books.png')
kid_room.books.resize(73)
kid_room.books.locate(837, 440)
kid_room.books.onClick = function () {
    printMessage("������ �н�����.")
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
            printMessage("�������ڴ�. ����ִ�.")
        }
        if (kid_room.treasureChestKey.isHanded()) {
            playSound("locking-keyed-padlock.wav")
            printMessage("�������ڰ� ���ȴ�.")
            kid_room.treasureChest.setSprite('Opened Treasure Chest.png')
            kid_room.treasureChest.unlock()
            treasure = 1
        }
    }
    else {
        printMessage("���� ����ִ�.")
    }
}








/*      â ��        */
outside = new Room('outside', '���ϴ�.png')

outside.arrow = new Object(outside, 'arrow', 'down_arrow.png')
outside.arrow.resize(100)
outside.arrow.locate(640, 650)
outside.arrow.onClick = function () {
    Game.move(kid_room)
}

// �Ž� Ʈ�� ������ ���� �� �ְԲ�
outside.grass = new Item(outside, 'grass', 'grass.png')
outside.grass.locate(500,500)
outside.grass.setDescription("�絹������ �����ϴ� Ǯ�̴�.")
//

// ���� �絹��
outside.rudolph1 = new Object(outside, 'rudolph1', '�絹��_���.png')
outside.rudolph1.resize(80)
outside.rudolph1.locate(900, 120)

// ū �絹��
outside.rudolph2 = new Object(outside, 'rudolph2', '�絹��_���.png')
outside.rudolph2.resize(600)
outside.rudolph2.locate(640, 400)
outside.rudolph2.hide()

outside.rudolph1.onClick = function () {
    printMessage("����� �ϴϱ� ���� ����. ���ӽ����� �� �ȴٴ� �ǰ�...")
    if (outside.grass.isHanded()) {
        printMessage("Ǯ�� ��������� �絹������ �Դ�!")
        outside.rudolph1.hide()
        outside.rudolph2.show()
    }
}

outside.rudolph2.onClick = function () {
    Game.end("Mission Clear!!")
}












Game.start(kid_room, '��Ż�⿡ ���� ���� ȯ���մϴ�!')