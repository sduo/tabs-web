
import { Dayjs } from 'dayjs';
import Url from './url';

export default interface Page {
    cursor: number,
    previous: number,
    next: number,
    size: number,
    search: string,
    range: Array<Dayjs>,
    rows: Array<Url>
}