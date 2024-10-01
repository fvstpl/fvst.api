import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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
        const authorizationHeader = request.headers['authorization'];
        
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }

        const token = authorizationHeader.split(' ')[1];
        const isCreatingShop = request.method === 'POST' && request.url.includes('/new');
        
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        let user;
        try {
            user = this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }

        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }
        
        if (isCreatingShop) {
            request.user = user;
            return true;
        }

        const shopId = request.params.id;
        const shop = await this.shopService.findShopById(shopId);
        if (!shop || shop.data.userId !== user.sub) {
            throw new UnauthorizedException('Unauthorized');
        }

        request.user = user;
        return true;
    }
}