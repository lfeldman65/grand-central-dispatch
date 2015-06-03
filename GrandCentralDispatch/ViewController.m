//
//  ViewController.m
//  GrandCentralDispatch
//
//  Created by Larry Feldman on 6/3/15.
//  Copyright (c) 2015 Larry Feldman. All rights reserved.
//

#import "ViewController.h"

@interface ViewController () {
    
    dispatch_queue_t myQueue;
}

@property (weak, nonatomic) IBOutlet UILabel *resultLabel;

- (IBAction)noGCDButtonPressed:(id)sender;

- (IBAction)gcdButtonPressed:(id)sender;

@end


@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}


- (IBAction)noGCDButtonPressed:(id)sender {
    
    [self longRunningOperation1];

}

-(void) longRunningOperation1 {
    [NSThread sleepForTimeInterval:5];
    [self.resultLabel setText:[NSString stringWithFormat:@"Results: %d", arc4random()]];
}


- (IBAction)gcdButtonPressed:(id)sender {
    
    if (!myQueue) {
        myQueue = dispatch_queue_create("com.example.gcd", NULL);
    }
    dispatch_async(myQueue, ^{[self longRunningOperation];});
}

-(void) longRunningOperation {
    [NSThread sleepForTimeInterval:5];
    
    dispatch_async(dispatch_get_main_queue(), ^{ [self.resultLabel setText:[NSString stringWithFormat:@"Results: %d", arc4random()]]; });
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];

}
@end
