/**
 使用can.Control来处理业务逻辑
 can.Control 创建了一个可组织，内在无泄漏，全权控制器，能用来创建widget或者处理业务逻辑。你通过所需要数据为一个DOM元素创建一个Control实例，可以在你的Control中定义方法绑定事件。
 当 Control 所关联的元素从DOM被删除时，Control会自去销毁自己，同时清除所绑定的方法。
 要创建一个 Control，通过传入你定义的包含有函数的对象给 can.Control() 来实现继承。接下来事件也给传进去了。
 每个Control实例都有几个重要的值和方法规范：
 this –  Control 实例的引用
 this.element – 实例中你所创建的DOM 元素
 this.options – 创建实例所需要的参数对象
 init() – 当实例创建成功时被调用
 */
Contacts = can.Control({
    init: function () {
        this.element.html(can.view('views/contactsList.ejs', {
            contacts: this.options.contacts,
            categories: this.options.categories
        }));
    }
})
/**
 当 Contacts 的实例被创建时， init() 会做两件事：
 使用can.view() 来渲染联系人。 can.view() 接收两个参数：包含有模板和数据的文件或者stript标签；将返回一个documentFragment (一个管理DOM元素的轻量容器)。
 使用jQuery.html()将can.view() 的documentFragment 插入Control的元素
 */

/**
 使用Model来表现数据. Model 是APP数据的抽象层
 一个model 有5个方法可能定义来CRUD数据， 分别是findAll, findOne, create, update 和 destroy。你可重写这几个方法，
 不过最好的办法是使用 REST 服务（Representational State Transfer表述性状态转移）。正如上面的代码，你放心的忽略APP中不会用到的静态方法了。
 这里要重点指出的是，model实例其实是源自 CanJS 的‘observables’。
 can.Observe 提供对象的观察者模式can.Observe.List 提供数组的观察模式。这意味着你可以通过attr()来get和set数据，同时监听数据的变动。
 findAll() 方法返回一个 Model.list，就是当元素被添加或者移除时 can.Observe.List 所触发的事件。
 */

Contact = can.Model({
    findAll: 'GET /contacts',
    create: "POST /contacts",
    update: "PUT /contacts/{id}",
    destroy: "DELETE /contacts/{id}"
}, {});

Category = can.Model({
    findAll: 'GET /categories'
}, {});


/** 模拟数据 */
/**
 使用Fixture来模仿Rest
 Fixture拦截 AJAX 请求并通过文件或者方法来模拟应答。这对测试，或者后端还没有就绪时是非常有用的。Fixture就是APP的model模拟REST所需要的。
 */
var CONTACTS = [
    {
        id: 1,
        name: 'William',
        address: '1 CanJS Way',
        email: 'william@husker.com',
        phone: '0123456789',
        category: 'co-workers'
    },
    {
        id: 2,
        name: 'Laura',
        address: '1 CanJS Way',
        email: 'laura@starbuck.com',
        phone: '0123456789',
        category: 'friends'
    },
    {
        id: 3,
        name: 'Lee',
        address: '1 CanJS Way',
        email: 'lee@apollo.com',
        phone: '0123456789',
        category: 'family'
    }
];

var CATEGORIES = [
    {
        id: 1,
        name: 'Family',
        data: 'family'
    },
    {
        id: 2,
        name: 'Friends',
        data: 'friends'
    },
    {
        id: 3,
        name: 'Co-workers',
        data: 'co-workers'
    }
];
/**
 有了数据，要将其连接到fixture来模拟REST 。can.fixture()接收两个参数。 我们要拦截的URL和我们应答用的文件和方法。
 通常你要拦截的URL都是动态且遵循一个模式的。在需要在URL里添加以{}括起的通配符即可。
 */
can.fixture('GET /contacts', function(){
    return [CONTACTS];
});
var id= 4;
can.fixture("POST /contacts", function(){
    return {id: (id++)}
});
can.fixture("PUT /contacts/{id}", function(){
    return {};
});
can.fixture("DELETE /contacts/{id}", function(){
    return {};
});
can.fixture('GET /categories', function(){
    return [CATEGORIES];
});


/**
 启动APP
 你的APP有管理数据的Model，渲染联系人的 View，将这一切组织起来的的Control。现在要做的就是启动APP了。 Now you need to kickstart the application!
 */

$(document).ready(function(){
    $.when(Category.findAll(), Contact.findAll()).then(
        function(categoryResponse, contactResponse){
            var categories = categoryResponse[0],
                contacts = contactResponse[0];

            new Contacts('#contacts', {
                contacts: contacts,
                categories: categories
            });
        });
});



