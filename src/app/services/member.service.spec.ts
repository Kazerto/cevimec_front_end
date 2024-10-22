import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MemberService } from './member.service';
import { Member, AccountStatus, MaritalStatus, BloodGroup, MemberRole } from '../models/member.model';
import { environment } from '../../environments/environment';

describe('MemberService', () => {
  let service: MemberService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/members`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MemberService]
    });
    service = TestBed.inject(MemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockMember: Member = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    birthDate: new Date('1990-01-01'),
    birthPlace: 'Libreville',
    country: 'Gabon',
    region: 'Estuaire',
    residencePlace: 'Centre ville',
    city: 'Libreville',
    profession: 'Engineer',
    phoneGabon: '+241 77123456',
    fatherName: 'Doe Sr',
    motherName: 'Jane Doe',
    maritalStatus: MaritalStatus.SINGLE,
    spouseIsMember: false,
    joinDate: new Date('2023-01-01'),
    bloodGroup: BloodGroup.O_POS,
    accountStatus: AccountStatus.ACTIVE,
    role: MemberRole.ADMINISTRATOR
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all members', () => {
    service.getAllMembers().subscribe(members => {
      expect(members).toEqual([mockMember]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockMember]);
  });

  it('should create a member', () => {
    service.createMember(mockMember).subscribe(member => {
      expect(member).toEqual(mockMember);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockMember);
  });

  it('should update a member', () => {
    service.updateMember(1, mockMember).subscribe(member => {
      expect(member).toEqual(mockMember);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockMember);
  });

  it('should delete a member', () => {
    service.deleteMember(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update member status', () => {
    const newStatus = AccountStatus.EXCLUDED;

    service.updateMemberStatus(1, newStatus).subscribe(member => {
      expect(member.accountStatus).toBe(newStatus);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: newStatus });
    req.flush({ ...mockMember, accountStatus: newStatus });
  });

  it('should search members', () => {
    const query = 'John';

    service.searchMembers(query).subscribe(members => {
      expect(members).toEqual([mockMember]);
    });

    const req = httpMock.expectOne(`${apiUrl}/search?query=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMember]);
  });
});
