import Request from "@/util/request";

class Statistic {
  prefix = "/statistics";

  byDate() {
    return Request.get(`${this.prefix}/by-date`);
  }
}

export default new Statistic();
