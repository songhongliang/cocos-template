import Global from '../Global'
import utils from '../utils/utils';
import WeChat from '../utils/wechat';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    /** 移动的物体 */
    @property(cc.Node)
    ball: cc.Node = null;

    /** 炮台 */
    @property(cc.Node)
    batteryNode: cc.Node = null;

    /** 子弹预制体 */
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    /** 加载框 */
    @property(cc.Prefab)
    loadingBox: cc.Prefab = null;

    /** 子弹对象池 */
    bulletPool: cc.NodePool = null;

    /** 速度状态 */
    sppedState: boolean = false;

    /** 速度倍数 */
    speed: number = 1;

    /** 缓动系数 */
    value: number = 30;

    /** 排行榜 */
    rankBox: cc.Node = null;

    // 打开排行榜
    openRank() {
        if (this.rankBox) {
            this.rankBox.active = true;
        } else {
            utils.loadPrefab('rank-box', res => {
                this.rankBox = cc.instantiate(res);
                this.rankBox.parent = this.node;
            });
        }
    }

    /** 分享或者看视频 */
    testShare() {
        WeChat.getReward(function () {
            console.log('领取成功!!!!!');
        }, 'xxx');
    }

    /** 设置 ball 颜色 */
    setBoxColor() {
        let color = {
            r: Math.floor(255 * Math.random()) + 1,
            g: Math.floor(255 * Math.random()) + 1,
            b: Math.floor(255 * Math.random()) + 1
        }
        // this.ball.color = new cc.color(color);
        this.ball.color = cc.color(color.r, color.g, color.b);
    }

    /** 从对象池获取子弹 */
    getBullet() {
        let bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
        }
        bullet.parent = this.node;
        // return bullet;
    }

    /** 创建子弹对象池 */
    createPool() {
        this.bulletPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(bullet);
        }
    }

    /** 发射 */
    launch(event) {
        // console.log(event, event.touch, event.touch._point);

        /** 点击的坐标位置 */
        let click_size = this.node.convertToNodeSpaceAR(event.touch._point);
        /** 旋转目标节点位置 */
        let node_size = this.batteryNode.getPosition();
        /** 弧度 */
        let radian = 0;
        /** 角度 */
        let angle = 0;

        // 方法一：
        if (click_size.y < node_size.y) {
            // 炮台向下
            radian = Math.atan((click_size.x - node_size.x) / (node_size.y - click_size.y));
            angle = radian * 180 / Math.PI + 180;
        } else {
            // 炮台向上
            radian = Math.atan((node_size.x - click_size.x) / (click_size.y - node_size.y));
            angle = radian * 180 / Math.PI;
        }

        /** 
         * 方法二：
         * 只有旋转节点坐标为(0, 0)才生效 所以要做下坐标偏移
        */
        // click_size.x = click_size.x - node_size.x;
        // click_size.y = click_size.y - node_size.y;
        // angle = utils.rotateAngle(click_size.x, click_size.y);

        // 最后节点角度旋转
        this.batteryNode.angle = angle;
        // console.log(angle);

        this.getBullet();
    }

    /** 初始化子弹发射 */
    initLaunch() {
        this.createPool();
        this.node.on('touchstart', this.launch, this);
        this.node.on('touchmove', this.launch, this);
    }

    /** 速度切换 */
    speedSwitch() {
        if (this.sppedState) {
            this.sppedState = false;
            this.speed = 1;
        } else {
            this.sppedState = true;
            this.speed = 0.2;
        }
    }

    // 加速
    accelerate() {
        this.speed = 2;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.Game = this;
        this.initLaunch();
        utils.setLoadingBox(cc.instantiate(this.loadingBox), this.node);
    }

    start() {

        // 设置 onshow 监听
        WeChat.onShow = res => {

        }

        // 设置 onhide 监听
        WeChat.onHide = () => {

        }
    }

    update(dt) {
        if (!this.ball) return;
        this.value -= 1 * this.speed;
        this.ball.y += this.value * this.speed;
        if (this.ball.y <= -500) {
            this.ball.y = -500;
            this.value = 30;
        }
    }
}
