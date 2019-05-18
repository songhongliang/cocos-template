const { ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;

/** UI 矩形圆角遮罩 */
@ccclass
@disallowMultiple   // 防止节点添加重复组件
@executeInEditMode  // 在编辑器里执行
@menu('自定义组件/矩形圆角遮罩')
@requireComponent(cc.Mask)
export default class RectMask extends cc.Component {
    /** 圆角半径 */
    @property({ visible: false })
    private radius: number = 20;
    
    /** 矩形大小 */
    @property({ visible: false })
    private size: cc.Vec2 = new cc.Vec2();

    @property({ displayName: '圆角半径' })
    protected get boxRadius(): number {
        return this.radius;
    }
    protected set boxRadius(value: number) {
        this.radius = value;
        this.drawRadius();
    }

    @property({ displayName: '矩形大小' })
    protected get boxSize(): cc.Vec2 {
        return this.size;
    }
    protected set boxSize(value: cc.Vec2) {
        this.size = value;
        // 设置容器和图片的大小
        this.node.setContentSize(value.x, value.y);
        this.image.setContentSize(value.x, value.y);
    }

    /** 子节点 image */
    @property({ visible: false })
    private image: cc.Node = null;

    /** 绘制圆角 */
    private drawRadius() {
        /** 当前节点尺寸 */
        let size = this.node.getContentSize();
        /** 矩形 */
        let rect = cc.rect(-size.width / 2, -size.height / 2, size.width, size.height);
        let graphics = this.getComponent(cc.Mask)['_graphics'];
        this.drawRoundRect(graphics, rect);
    }

    /**
     * 绘制圆角矩形
     * @param {cc.Graphics} graphics 
     * @param {cc.Rect} rect 
     */
    private drawRoundRect(graphics: cc.Graphics, rect: cc.Rect) {
        let { x, y, width, height } = rect;
        //清空所有路径
        graphics.clear();
        //线条宽度
        graphics.lineWidth = 1;
        //矩形
        graphics.roundRect(x, y, width, height, this.radius);
        //填充
        graphics.fill();
        //绘制
        graphics.stroke();
    }

    /** 创建 image */
    private createImage() {
        if (cc.find('image', this.node)) return;
        this.image = new cc.Node('image');
        this.image.parent = this.node;
        this.image.addComponent(cc.Sprite);
        /** 图片组件 */
        let image_sprite = this.image.getComponent(cc.Sprite);
        image_sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    }

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        // 这里每次都要重新绘画
        this.drawRadius();
    }

    start() {
        // 这里写在onload里面不生效
        this.createImage();
        // console.log(this.size, this.radius);
    }
}
