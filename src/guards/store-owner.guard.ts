import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ShopService } from '../shop/shop.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private shopService: ShopService,
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.['authorization']?.split(' ')[1];
        const isCreatingShop = request.method === 'POST' && request.url.includes('/new');
        
        if (!token) {
            return false;
        }

        let user;
        try {
            user = this.jwtService.verify(token);
        } catch (e) {
            return false;
        }

        if (!user) {
            return false;
        }
        
        if (isCreatingShop) {
            request.user = user;
            return true;
        }

        const shopId = request.params.id;
        const shop = await this.shopService.findShopById(shopId);
        if (!shop || shop.data.userId !== user.id) {
            return false;
        }

        request.user = user;
        return true;
    }
}