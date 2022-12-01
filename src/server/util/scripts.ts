export function countScript() {
    return `
    // parse string date
    ZonedDateTime parseDate(def dateStr) {
      return ZonedDateTime.ofInstant(Instant.parse(dateStr), TimeZone.getDefault().toZoneId());
    }
    int getWeekIndexOfYear(def date, def firstDayWeek){
        DayOfWeek dayOfWeek = DayOfWeek.valueOf(firstDayWeek);
        date = date.with(TemporalAdjusters.previousOrSame(dayOfWeek)).plusWeeks(1);
        return date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }
    // left pad array for trend;
    ArrayList leftPadArray(def arr,def padLength){
      def newArr = new def[padLength];
      def updatePos =padLength - arr.length;
      for(int i = 0;i < padLength;i++){
        def index =  i - updatePos;
        newArr[i] = 0;
        if(index >= 0){
          newArr[updatePos + index] = arr[index] 
        }
      }
      return new ArrayList(Arrays.asList(newArr));
    }
    
    long getDayPeriod(def oldDate,def newDate){
      return Period.between(oldDate.toLocalDate(),newDate.toLocalDate()).getDays();
    }
    
    int getWeekPeriod(def oldDate,def curDate){
      def dayPeriod = Duration.between(curDate,oldDate).toDays();
      def weekPeriod = (int)Math.floor(dayPeriod / 7);
      def offset = oldDate.getDayOfWeek().getValue() + dayPeriod % 7 > 7 ? 1 :0;
      return weekPeriod + offset;
    }
    
    int getMonthPeriod(def oldDate, def curDate) {
        Calendar c1 = Calendar.getInstance();
        Calendar c2 = Calendar.getInstance();
        c1.setTime(Date.from(curDate.toInstant()));
        c2.setTime(Date.from(oldDate.toInstant()));
        if(c1.getTimeInMillis() < c2.getTimeInMillis()) return 0;
        int year1 = c1.get(Calendar.YEAR);
        int year2 = c2.get(Calendar.YEAR);
        int month1 = c1.get(Calendar.MONTH);
        int month2 = c2.get(Calendar.MONTH);
        int day1 = c1.get(Calendar.DAY_OF_MONTH);
        int day2 = c2.get(Calendar.DAY_OF_MONTH);
        
        int yearInterval = year1 - year2;
      
        if(month1 < month2 || month1 == month2 && day1 < day2) yearInterval --;
        
        int monthInterval = (month1 + 12) - month2 ;
        if(day1 < day2) monthInterval --;
        monthInterval %= 12;
        return yearInterval * 12 + monthInterval;
    }
    
    int getYearPeriod(def oldDate,def curDate){
        int monthInterval = getMonthPeriod(oldDate,curDate);
        int yearInterval = (int)Math.floor(monthInterval / 12);
    
        int offset = monthInterval % 12 + oldDate.getMonthValue()  > 12 ? 1 : 0;
        return yearInterval + offset;
    }
      
    def curDate= parseDate(params.update_at);
    def oldDate= parseDate(ctx._source.update_at);
    
    // get date
    def curYear = curDate.getYear();
    def oldYear = oldDate.getYear();
    def curMonth = curDate.getMonth();
    def oldMonth = oldDate.getMonth();
    def curDay = curDate.getDayOfMonth();
    def oldDay = oldDate.getDayOfMonth();
    
    def dayPeriod = getDayPeriod(oldDate, curDate);
    
    def curWeekIndex = getWeekIndexOfYear(curDate,"MONDAY");
    def oldWeekIndex =  getWeekIndexOfYear(oldDate,"MONDAY");
    
    // do update date count
    ctx._source.package_name=params.package_name;
    ctx._source.total+=params.count;
   
    ctx._source.this_year= curYear == oldYear ? params.count + ctx._source.this_year : params.count;
    ctx._source.this_month= curYear == oldYear && curMonth == oldMonth ? params.count + ctx._source.this_month : params.count;
    def thisWeekCount = curYear == oldYear && curWeekIndex == oldWeekIndex ? params.count + ctx._source.this_week : params.count;
    ctx._source.this_week= thisWeekCount;
    
    if(ctx._source.today == null){
      ctx._source.today = 0;
    }
    
    ctx._source.today = dayPeriod == 0 ? params.count + ctx._source.today : params.count;
    
    // update versions
    for(key in ctx._source.versions.keySet()){
      def dayListLength = 7;
      def old7Day = ctx._source.versions[key];
      
      def newCount = params.versions[key];
      if(old7Day instanceof ArrayList){
        if(dayPeriod == 0){
          if(newCount == null){
            continue;
          }
          def lastIndex = old7Day.length - 1;
          old7Day.set(lastIndex, old7Day[lastIndex] + newCount);
          ctx._source.versions[key] = leftPadArray(old7Day, dayListLength);
        } else {
          // only count 7 day so the loop in maxium could execute 7 time
          for(int i = 1;i < dayPeriod && i < dayListLength; i++){
            old7Day.add(0);
          }
          old7Day.add(newCount == null ? 0 : newCount);
          ctx._source.versions[key] = leftPadArray(old7Day, dayListLength);
        }
      }
      
      if(ctx._source.versions[key] instanceof Long || ctx._source.versions[key] instanceof Integer){
        ctx._source.versions[key] = leftPadArray(new ArrayList([ctx._source.versions[key]]), 7);
      }
      
      if(ctx._source.versions[key] == null){
        ctx._source.versions[key] = leftPadArray([newCount], 7);
      }
    }
    
    // update trend
    if(curYear != oldYear || curWeekIndex != oldWeekIndex){
      def weekPeriod = getWeekPeriod(curDate,oldDate);
      for(int i = 1;i< weekPeriod; i++){
            ctx._source.trend.add(0);
      }
      ctx._source.trend.add(params.count);
      ctx._source.trend = leftPadArray(ctx._source.trend,60);
    } else {
      def lastIndex = ctx._source.trend.length - 1;
      ctx._source.trend.set(lastIndex,ctx._source.trend[lastIndex]+params.count);
      ctx._source.trend=leftPadArray(ctx._source.trend,60);
    }
    
    ctx._source.update_at = params.update_at;
    `;
}

export const INDEX_MAPPING = {
    properties: {
        package_name: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                },
            },
        },
        today: {
            type: 'long',
        },
        this_month: {
            type: 'long',
        },
        this_week: {
            type: 'long',
        },
        this_year: {
            type: 'long',
        },
        total: {
            type: 'long',
        },
        trend: {
            type: 'long',
        },
        update_at: {
            type: 'date',
        },
        versions: {
            type: 'flattened',
        },
    },
};
