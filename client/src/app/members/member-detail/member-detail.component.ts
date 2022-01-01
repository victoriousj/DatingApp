import { MembersService } from './../../_services/members.service';
import { Member } from 'src/app/_models/member';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
    member: Member;
    galleryOptions: NgxGalleryOptions[] = [];
    galleryImages: NgxGalleryImage[] = [];

    constructor(private memberService: MembersService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.loadMember();

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false,
            },
        ];
    }

    getImages(): NgxGalleryImage[] {
        const imageUrls = [];
        for (const photo of this.member!.photos) {
            imageUrls.push({
                small: photo.url,
                medium: photo.url,
                large: photo.url,
            });
        }
        return imageUrls;
    }

    loadMember() {
        const userName = this.route.snapshot.paramMap.get('username');

        if (userName !== null) {
            this.memberService.getMember(userName).subscribe(
                (member) => {
                    this.member = member;
                    this.galleryImages = this.getImages();
                },
                () => {
                    this.router.navigateByUrl('not-found');
                }
            );
        }
    }
}
