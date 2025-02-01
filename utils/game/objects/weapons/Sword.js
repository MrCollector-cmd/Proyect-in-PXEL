import { SwordAssets } from "../../assets/SwordAssets.js";
import { contextThisGame } from "../context.js";

class Sword {
    constructor({ cooldown = 300 } = {}) {
        const sizes = SwordAssets.getSizes();
        this.inventorySize = sizes.inventory;
        this.handSize = sizes.hand;

        this.cooldown = cooldown;
        this.lastAttackTime = 0;
        this.attackRange = 50;
        this.attackPower = 15;
        this.currentFrame = SwordAssets.getFrames().frame1;

        this.rotationAngle = -46 * (Math.PI / 180);
        this.targetRotationAngle = 0;
        this.rotationSpeed = 5 * (Math.PI / 180);

        this.isAnimating = false;
        this.shouldReturn = false;
    }

    drawInInventory(context, x, y, slotSize) {
        const frame = this.currentFrame;
        if (frame?.complete) {
            const xOffset = (slotSize - this.inventorySize.width) / 2;
            const yOffset = (slotSize - this.inventorySize.height) / 2;
            context.drawImage(
                frame,
                x + xOffset,
                y + yOffset,
                this.inventorySize.width,
                this.inventorySize.height
            );
        }
    }

    drawInHand(context, playerX, playerY, cameraOffsetX = 0, cameraOffsetY = 0) {
        const handOffset = { x: -8, y: 20 };
        const flip = this.isAnimating ? this.initialFlip : contextThisGame.player.direction;

        const angle = this.rotationAngle * (flip ? -1 : 1);
        const rotatedOffset = this._rotateOffset(handOffset, angle);

        const swordX = playerX - cameraOffsetX + rotatedOffset.x;
        const swordY = playerY - cameraOffsetY + rotatedOffset.y;

        context.save();
        context.translate(swordX, swordY);
        if (flip) context.scale(-1, 1);
        context.rotate(this.rotationAngle);
        context.drawImage(
            this.currentFrame,
            0,
            -this.handSize.height / 2,
            this.handSize.width,
            this.handSize.height
        );
        context.restore();
    }

    startAnimation(targetAngle) {
        if (this.isAnimating) return;
        this.targetRotationAngle = targetAngle * (Math.PI / 180);
        this.isAnimating = true;
        this.initialFlip = contextThisGame.player.direction;
        this.shouldReturn = false;
    }

    updateAnimation() {
        if (!this.isAnimating) return;
        const maxSpeed = 1;
        const acceleration = 0.6;

        if (!this.shouldReturn) {
            this.rotationSpeed = Math.min(this.rotationSpeed + acceleration, maxSpeed);
            const angleDiff = this._normalizeAngle(this.targetRotationAngle - this.rotationAngle);

            if (Math.abs(angleDiff) < this.rotationSpeed) {
                this.rotationAngle = this.targetRotationAngle;
                this.shouldReturn = true;
                this.rotationSpeed = maxSpeed;
            } else {
                this.rotationAngle += Math.sign(angleDiff) * this.rotationSpeed;
            }
        } else {
            const returnSpeed = 0.08;
            const returnAngle = -46 * (Math.PI / 180);
            const angleDiff = this._normalizeAngle(returnAngle - this.rotationAngle);

            if (Math.abs(angleDiff) < returnSpeed) {
                this.rotationAngle = returnAngle;
                this.isAnimating = false;
                this.shouldReturn = false;
                contextThisGame.player.attack = false;
                this.rotationSpeed = 0;
            } else {
                this.rotationAngle += Math.sign(angleDiff) * returnSpeed;
            }
        }

        this.attack(contextThisGame.enemies);
    }

    attack(enemies) {
        if (!this.isAnimating) return;

        const { offsetX, offsetY } = contextThisGame.camera.getOffset();
        const player = contextThisGame.player;

        const playerX = player.x - offsetX;
        const playerY = player.y - offsetY;

        const swordTip = this._calculateSwordTip(playerX, playerY, player.direction);

        const swordRect = {
            x: swordTip.x - this.handSize.width / 2,
            y: swordTip.y - this.handSize.height / 2,
            width: this.handSize.width,
            height: this.handSize.height,
        };

        enemies.forEach((enemy) => {
            const enemyRect = {
                x: enemy.x - offsetX,
                y: enemy.y - offsetY,
                width: enemy.width,
                height: enemy.height,
            };

            if (this._isColliding(swordRect, enemyRect)) {
                enemy.stats.heal -= this.attackPower;
                if (enemy.stats.heal <= 0) {
                    contextThisGame.player.stats.xp += enemy.stats.xp;
                    contextThisGame.enemies = contextThisGame.enemies.filter(e => e !== enemy);
                }
            }
        });
    }

    _rotateOffset(offset, angle) {
        return {
            x: Math.cos(angle) * offset.x - Math.sin(angle) * offset.y,
            y: Math.sin(angle) * offset.x + Math.cos(angle) * offset.y,
        };
    }

    _calculateSwordTip(playerX, playerY, direction) {
        const offsetX = direction ? -140 : 20;
        const swordTipX = playerX + offsetX + Math.cos(this.rotationAngle) * this.attackRange;
        const swordTipY = playerY + Math.sin(this.rotationAngle) * this.attackRange;
        return { x: swordTipX, y: swordTipY };
    }

    _normalizeAngle(angle) {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }

    _isColliding(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
}

export { Sword };
